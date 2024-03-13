import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSideSession } from "@/lib/auth";
import { getPusherInstance } from "@/lib/pusher/server";
import { userSelectedFields } from "../notifications/route";

const pusherServer = getPusherInstance();

export const POST = async (request: NextRequest) => {
  const url = new URL(request.url);
  const commentId = url.searchParams.get("commentId");
  const session = await getServerSideSession();
  const userId = session?.user.id as string;

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

    if (!commentId) {
      return NextResponse.json(
        {
          message: "Missing comment id",
        },
        { status: 400 },
      );
    }

    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return NextResponse.json(
        {
          message: "Comment not found",
        },
        { status: 404 },
      );
    }

    const existingUpvote = await db.commentUpvote.findFirst({
      where: {
        userId,
        commentId,
      },
    });

    if (existingUpvote) {
      return NextResponse.json(
        {
          message: "You have an existing upvote, for this specific comment",
          success: false,
        },
        { status: 400 },
      );
    }

    await db.commentUpvote.create({
      data: {
        userId,
        commentId,
      },
    });

    //increase the comment count by 1
    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        upvoteCount: {
          increment: 1,
        },
      },
    });

    //to avoid sending and creating notification if the user upvoted its own post
    // if (userId !== post.authorId) {
    //   const notification = await db.notification.create({
    //     data: {
    //       recipientId: post.authorId,
    //       senderId: userId,
    //       commentId,
    //       type: "UPVOTE",
    //     },
    //     include: {
    //       sender: {
    //         select: {
    //           ...userSelectedFields,
    //         },
    //       },
    //       post: {
    //         include: {
    //           blog: true,
    //           diary: true,
    //           author: {
    //             select: {
    //               ...userSelectedFields,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   });

    //   const channel = `channel_user_${notification.recipientId}`;
    //   const event = "new-notification";

    //   await pusherServer.trigger(channel, event, {
    //     notification,
    //   });
    // }

    return NextResponse.json(
      {
        message: "Comment upvoted",
      },
      { status: 201 },
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

export const DELETE = async (request: NextRequest) => {
  const url = new URL(request.url);
  const commentId = url.searchParams.get("commentId");
  const session = await getServerSideSession();
  const userId = session?.user.id as string;

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

    if (!commentId) {
      return NextResponse.json(
        {
          message: "Missing comment id",
        },
        { status: 201 },
      );
    }

    const existingUpvote = await db.commentUpvote.findFirst({
      where: {
        userId,
        commentId,
      },
    });

    if (!existingUpvote) {
      return NextResponse.json(
        {
          message: "You did not upvoted this comment",
          success: false,
        },
        { status: 400 },
      );
    }

    await db.commentUpvote.delete({
      where: {
        id: existingUpvote?.id,
      },
    });

    //decrease the comment count by 1
    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        upvoteCount: {
          decrement: 1,
        },
      },
    });

    // const existingNotification = await db.notification.findFirst({
    //   where: {
    //     senderId: userId,
    //     commentId,
    //   },
    // });

    // if (existingNotification) {
    //   await db.notification.delete({
    //     where: {
    //       id: existingNotification.id,
    //     },
    //   });
    // }

    return NextResponse.json(
      {
        message: "Upvote removed",
      },
      { status: 201 },
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
