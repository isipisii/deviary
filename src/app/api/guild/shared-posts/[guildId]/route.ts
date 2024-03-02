import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

const userSelectedFields = {
  name: true,
  id: true,
  image: true,
  email: true,
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { guildId: string } },
) => {
  const session = await getServerSideSession();
  const guildId = params.guildId;

  try {
    // get page and lastCursor from query
    const url = new URL(req.url);
    const take = Number(url.searchParams.get("take"));
    const lastCursor = url.searchParams.get("lastCursor") as string;
    const userId = session?.user.id;

    const guildSharedPosts = await db.guildShare.findMany({
      where: {
        guildId,
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
        guild: true,
        user: {
          select: {
            ...userSelectedFields,
          },
        },
        post: {
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
        },
      },
    });

    if (guildSharedPosts.length === 0) {
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
    const lastSharedPostInResults = guildSharedPosts.at(-1);
    const cursor = lastSharedPostInResults?.id;

    const nextPage = await db.guildShare.findMany({
      where: {
        guildId,
      },
      take: take ? Number(take) : 10,
      skip: 1,
      orderBy: {
        createdAt: "desc",
      },
      cursor: {
        id: cursor,
      },
    });

    guildSharedPosts.forEach((sharedPost) => {
      (sharedPost as any).post.isUpvoted = sharedPost.post._count.upvotes > 0;
      (sharedPost as any).post.isBookmarked = sharedPost.post._count.bookmarks > 0;
    });

    const sharedPostWithoutAggregateField = guildSharedPosts.map((sharedPost) => {
      const { post: { _count, ...restPost }, ...restSharedPost } = sharedPost;

      return { ...restSharedPost, post: { ...restPost } };
    });

    const data = {
      data: sharedPostWithoutAggregateField,
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
