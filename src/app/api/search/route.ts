import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const query = decodeURI(url.searchParams.get("query") as string).trim();
  // const lastCursor = url.searchParams.get("lastCursor") as string
  // const take = Number(url.searchParams.get("take"))
  const session = await getServerSideSession();

  try {
    if (!query) {
      return NextResponse.json(
        { message: "Missing search params" },
        { status: 400 },
      );
    }

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
        OR: [
          {
            blog: {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            diary: {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },

      // take: take ?? 5,
      // ...(lastCursor && {
      //     skip: 1,
      //     cursor: {
      //         id: lastCursor
      //     }
      // }),
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
              where: { userId: session.user.id },
            },
            bookmarks: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    });

    posts.forEach((post) => {
      (post as any).isUpvoted = post._count.upvotes > 0;
      (post as any).isBookmarked = post._count.bookmarks > 0;
    });

    const postsWithoutAggregateField = posts.map((post) => {
      const { _count, ...rest } = post;

      return rest;
    });

    return NextResponse.json(
      { succes: true, data: postsWithoutAggregateField },
      { status: 200 },
    );
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
