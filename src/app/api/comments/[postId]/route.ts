import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";

type TParams = {
  params: {
    postId: string;
  };
};

export const GET = async (request: NextRequest, { params }: TParams) => {
  const url = new URL(request.url);
  const postId = params.postId;
  const take = Number(url.searchParams.get("take"));
  const lastCursor = url.searchParams.get("lastCursor") as string;

  try {
    const comments = await db.comment.findMany({
      where: {
        postId,
      },

      take: take ?? 5,
      ...(lastCursor && {
        cursor: {
          id: lastCursor,
        },
        skip: 1,
      }),

      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (comments.length === 0) {
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

    const lastComment = comments.at(-1);
    const cursor = lastComment?.id;

    const nextPage = await db.comment.findMany({
      take: take ?? 5,
      skip: 1,
      cursor: {
        id: cursor,
      },
    });

    const data = {
      data: comments,
      metaData: {
        lastCursor: cursor,
        hasNextPage: nextPage.length > 0,
      },
    };

    return NextResponse.json(
      {
        data,
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    NextResponse.json(
      {
        error,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest, { params }: TParams) => {
  const session = await getServerSideSession();
  const postId = params.postId;
  const body = (await request.json()) as { content: string };
  const { content } = body;

  try {
    if (!content) {
      return NextResponse.json(
        {
          message: "Missing comment content",
          successs: false,
        },
        { status: 400 },
      );
    }

    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthenticated, please log in first",
          success: false,
        },
        { status: 400 },
      );
    }

    const newComment = await db.comment.create({
      data: {
        postId,
        userId: session.user.id,
        content
      }
    })

    return NextResponse.json(
      {
        data: newComment,
        success: true,
        message: "Comment created",
      },
      { status: 200 },
    );

  } catch (error) {
    NextResponse.json(
      {
        error,
        message: "Internal Server Error",
        successs: false,
      },
      { status: 500 },
    );
  }
};
