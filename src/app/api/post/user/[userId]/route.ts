import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params: { userId } }: { params: { userId: string } },
) => {
  const session = await getServerSideSession();
  const authenticatedUserId = session?.user.id as string;

  try {
    // get page and lastCursor from query
    const url = new URL(request.url);
    const take = Number(url.searchParams.get("take"));
    const lastCursor = url.searchParams.get("lastCursor") as string;
    const postType = url.searchParams.get("type") as
      | "BLOG_POST"
      | "CODE_DIARY";

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
      where: {
        authorId: userId,
        ...(postType && {
          type: postType,
        }),
      },
      take: take ? Number(take) : 10,
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
              where: { userId: authenticatedUserId },
            },
            bookmarks: {
              where: { userId: authenticatedUserId },
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
      where: {
        authorId: userId,
        ...(postType && {
          type: postType,
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: take ? Number(take) : 10,
      skip: 1,
      cursor: {
        id: cursor,
      },
    });

    const postsWithoutAggregateField = posts.map((post) => {
      const { _count, ...restFields } = post;

      return {
        ...restFields,
        isUpvoted: _count.upvotes > 0,
        isBookmarked: _count.bookmarks > 0,
      };
    });

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
