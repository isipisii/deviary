import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    const session = await getServerSideSession();
    const url = new URL(request.url);

    /** the comment or reply where the user wants to reply */ 
    const commentId = url.searchParams.get("commentId")
     /** the base comment id of a certain post */ 
    const rootCommentId = url.searchParams.get("rootCommentId")
    const body = (await request.json()) as { content: string };
    const { content } = body;
  
    try {
      if (!commentId) { 
        return NextResponse.json(
          {
            message: "Missing comment id",
            successs: false,
          },
          { status: 400 },
        );
      }
  
      if (!content) {
        return NextResponse.json(
          {
            message: "Missing reply content",
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
  
      const newCommentReply = await db.comment.create({
        data: {
          parentId: commentId,
          userId: session.user.id,
          rootCommentId,
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
          post: true
        },
      });
  
      // if (post.authorId !== session.user.id) {
      //   const notification = await db.notification.create({
      //     data: {
      //       senderId: session.user.id,
      //       recipientId: post.authorId,
      //       commentId: newComment.id,
      //       type: "COMMENT",
      //     },
      //     include: {
      //       sender: {
      //         select: {
      //           ...userSelectedFields
      //         },
      //       },
      //       comment: {
      //         select: {
      //           content: true,
      //           post: {
      //             include: {
      //               blog: true,
      //               diary: true,
      //               author: {
      //                 select: {
      //                   ...userSelectedFields
      //                 }
      //               }
      //             }
      //           }
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
          newCommentReply,
          success: true,
          message: "Comment reply created",
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
  