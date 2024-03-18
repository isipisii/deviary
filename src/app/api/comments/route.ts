import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";
import { getPusherInstance } from "@/lib/pusher/server";
import { userSelectedFields } from "../notifications/route";

const pusherServer = getPusherInstance();

export const GET = async (request: NextRequest) => {
  const session = await getServerSideSession();
  const isAuthenticated = !!session?.user.id
  const url = new URL(request.url);
  const postId = url.searchParams.get("postId") as string;
  const take = url.searchParams.get("take");
  const lastCursor = url.searchParams.get("lastCursor") as string;

  try {
    if (!postId) {
      return NextResponse.json(
        {
          message: "Missing post id",
          successs: false,
        },
        { status: 400 },
      );
    }

    const comments = await db.comment.findMany({
      where: {
        postId,
      },
      take: take ? Number(take) : 10,
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
        _count: {
          select: {
            upvotes: {
              where: { userId: session?.user.id },
            },
          },
        },
        commentReplies: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
            parent: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
            _count: {
              select: {
                upvotes: {
                  where: { userId: session?.user.id },
                },
              },
            },
          },
        },
        post: true
      },
      orderBy: {
        createdAt: "desc",
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
      where: {
        postId,
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

    const commentsWithoutAggregateField = comments.map((comment) => {
      const { _count, ...commentRestFields } = comment;

      return {
        ...commentRestFields,
        isUpvoted: isAuthenticated ? _count.upvotes > 0 : false,
        commentReplies: comment.commentReplies.map((commentReply) => {
          const { _count, ...commentReplyRestFields } = commentReply;
          return {
            ...commentReplyRestFields,
            isUpvoted: isAuthenticated ? _count.upvotes > 0 : false,
          };
        }),
      };
    });

    const data = {
      data: commentsWithoutAggregateField,
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
    return NextResponse.json(
      {
        error,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};

export const POST = async (request: NextRequest) => {
  const session = await getServerSideSession();
  const url = new URL(request.url);
  const postId = url.searchParams.get("postId") as string;
  const body = (await request.json()) as { content: string };
  const { content } = body;

  try {
    if (!postId) {
      return NextResponse.json(
        {
          message: "Missing post id",
          successs: false,
        },
        { status: 400 },
      );
    }

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

    const post = await db.post.findUnique({
      where: {
        id: postId,
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

    const newComment = await db.comment.create({
      data: {
        postId,
        userId: session.user.id,
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
        _count: {
          select: {
            upvotes: {
              where: { userId: session?.user.id },
            },
          },
        },
        post: true
      },
    });

    if (post.authorId !== session.user.id) {
      const notification = await db.notification.create({
        data: {
          senderId: session.user.id,
          recipientId: post.authorId,
          commentId: newComment.id,
          type: "COMMENT",
        },
        include: {
          sender: {
            select: {
              ...userSelectedFields,
            },
          },
          comment: {
            select: {
              content: true,
              post: {
                include: {
                  blog: true,
                  diary: true,
                  author: {
                    select: {
                      ...userSelectedFields,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const channel = `channel_user_${notification.recipientId}`;
      const event = "new-notification";

      await pusherServer.trigger(channel, event, {
        notification,
      });
    }

    const { _count, ...rest } = newComment
    const newCommentWithoutAggregateField = {
      ...rest,
      isUpvoted: _count.upvotes > 0 
    }

    return NextResponse.json(
      {
        newComment: newCommentWithoutAggregateField,
        success: true,
        message: "Comment created",
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
