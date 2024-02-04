import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type TParams = {
  params: {
    commentId: string;
  };
};

export const PATCH = async (request: NextRequest, { params }: TParams) => {
  const session = await getServerSideSession();
  const commentId = params.commentId;
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

    const updatedComment = await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
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

    return NextResponse.json(
      {
        updatedComment,
        success: true,
        message: "Comment updated",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: "Internal Server Error",
        successs: false,
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (request: NextRequest, { params }: TParams) => {
  const session = await getServerSideSession();
  const commentId = params.commentId;

  try {
    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthenticated, please log in first",
          success: false,
        },
        { status: 400 },
      );
    }

    await db.comment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Comment deleted",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error,
        message: "Internal Server Error",
        successs: false,
      },
      { status: 500 },
    );
  }
};
