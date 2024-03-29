import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";

type TParams = {
  params: {
    postId: string;
  };
};

export const POST = async (request: NextRequest, { params }: TParams) => {
  const session = await getServerSideSession();
  const postId = params.postId;

  try {
    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthenticated, please log in first",
          success: false,
        },
        { status: 401 },
      );
    }

    //checks if the post has been bookmarked by the user
    const existingBookmark = await db.bookmark.findFirst({
      where: {
        postId,
        userId: session?.user.id as string,
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        {
          message: "Post has already been bookmarked",
          success: false,
        },
        { status: 409 },
      );
    }

    const createdBookmark = await db.bookmark.create({
      data: {
        postId,
        userId: session?.user.id as string,
      },
      include: {
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
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: createdBookmark,
        message: "Bookmark created",
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 },
    );
  }
};
