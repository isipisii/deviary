import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";

export const GET = async (request: NextRequest) => {
  const session = await getServerSideSession();
  const userId = session?.user.id as string

  try {
    // get page and lastCursor from query
    const url = new URL(request.url);

    const take = Number(url.searchParams.get("take"));
    const lastCursor = url.searchParams.get("lastCursor") as string;
    const filter = url.searchParams.get("filter")?.toString().split(",");

    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthenticard, please log in first",
          success: false,
        },
        { status: 400 },
      );
    }

    const posts = await db.post.findMany({
      //puts the where clause if there's a filter from the search params
      ...(filter && {
        where: {
          tags: {
            hasSome: filter,
          },
        },
      }),
      take: take ?? 10,
      //same as with the filter
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        createdAt: "desc",
      },

      include: {
        blog: true,
        diary: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            upvotes: {
              where: { userId },
            },
            bookmarks: {
              where: { userId },
            },
          },
        },
      },
    });

    //if no data remaining
    if (posts.length === 0) {
      return NextResponse.json(
        {
          data: [],
          metaData: {
            lastCursor: null,
            hasNextPage: false,
          },
        },
        { status: 200 },
      );
    }

    //gets the last post's id to use in getting the next page
    const lastPostInResults = posts.at(-1);
    const cursor = lastPostInResults?.id;

    const nextPage = await db.post.findMany({
      take: take ?? 7,
      skip: 1,
      cursor: {
        id: cursor,
      },
    });

    //appends an isBookmarked and  field to easily distinguish if a certain post is being bookmarked and upvoted by the user
    // const postsWithisBookmarkedAndIsUpvotedField = await Promise.all(
    //   posts.map(async (post) => {
    //     const userId = session.user.id;

    //     const isUpvoted = userId
    //       ? (await db.upvote.count({
    //           where: {
    //             postId: post.id,
    //             userId: userId,
    //           },
    //         })) > 0
    //       : false;

    //     const isBookmarked = userId
    //       ? (await db.bookmark.count({
    //           where: {
    //             postId: post.id,
    //             userId: userId,
    //           },
    //         })) > 0
    //       : false;

    //     const bookmark = await db.bookmark.findFirst({
    //       where: {
    //         postId: post.id,
    //         userId: userId,
    //       },
    //       select: {
    //         id: true,
    //       },
    //     });

    //     return { ...post, isBookmarked, bookmarkId: bookmark?.id, isUpvoted };
    //   }),
    // );

    posts.forEach((post) => {
      (post as any).isUpvoted = post._count.upvotes > 0;
      (post as any).isBookmarked = post._count.bookmarks > 0;
    });

    const postsWithoutAggregateField = posts.map((post) => {
      const {_count, ...rest} = post

      return rest
    })

    const data = {
      data: postsWithoutAggregateField,
      metaData: {
        lastCursor: cursor,
        hasNextPage: nextPage.length > 0,
      },
    };

    return NextResponse.json({ data, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};
