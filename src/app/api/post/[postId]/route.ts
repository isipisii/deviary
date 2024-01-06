import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSideSession } from "@/lib/auth";
import { utapi } from "@/utils/uploadthingapi";

type TParams = {
  params: { postId: string };
};

export const GET = async (request: NextRequest, { params }: TParams) => {
  const postId = params.postId;
  const session = await getServerSideSession();

  try {
    const post = await db.post.findUnique({
      where: {
        id: postId,
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
      },
    });

    if (!post) {
      return NextResponse.json(
        {
          message: "Post not found",
          success: false,
        },
        { status: 404 },
      );
    }

    const isBookmarked =
      (await db.bookmark.count({
        where: {
          postId: post.id,
          userId: session?.user.id,
        },
      })) > 0;

    return NextResponse.json(
      {
        success: true,
        data: {
          ...post,
          isBookmarked,
        },
        message: "Post found",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error,
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (request: NextRequest, { params }: TParams) => {
  const session = await getServerSideSession();
  const postId = params.postId;

  try {
    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthenticated, please log in first",
        },
        { status: 500 },
      );
    }

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        blog: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        {
          message: "Post not found",
        },
        { status: 404 },
      );
    }

    //delete thumbnail if the post is blog
    if (post?.blog) {
      await utapi.deleteFiles(post.blog.thumbnail.imageKey);
    }

    const deletedPost = await db.post.delete({
      where: {
        id: postId,
      },
    });

    return NextResponse.json(
      {
        deletedPost: deletedPost,
        message: "Blog post deleted",
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error,
      },
      { status: 500 },
    );
  }
};
