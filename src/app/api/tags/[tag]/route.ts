import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSideSession } from "@/lib/auth";

type TParams = { 
  params: { tag: string }
}

export const GET = async (
  request: NextRequest,
  { params }: TParams,
) => {
  const session = await getServerSideSession();
  const userId = session?.user.id as string;
  const url = new URL(request.url);

  const take = url.searchParams.get("take");
  const lastCursor = url.searchParams.get("lastCursor") as string;

  try {
    const posts = await db.post.findMany({
      where: {
        tags: {
          has: params.tag,
        },
      },
      take: take ? Number(take) : 5,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
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
      take: take ? Number(take) : 10,
      skip: 1,
      cursor: {
        id: cursor,
      },
    });

    posts.forEach((post) => {
      (post as any).isUpvoted = post._count.upvotes > 0;
      (post as any).isBookmarked = post._count.bookmarks > 0;
    });

    const postsWithoutAggregateField = posts.map((post) => {
      const { _count, ...restFields } = post;

      return restFields;
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