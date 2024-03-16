import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const session = await getServerSideSession(); 
  const url = new URL(req.nextUrl);
  const postId = url.searchParams.get("postId");
  
  try {
    if (!postId) {
      return NextResponse.json(
        {
          message: "Bad Request, missing postId",
          success: false,
        },
        { status: 400 },
      );
    }

    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthenticated",
          success: false,
        },
        { status: 401 },
      );
    }

    await db.readingHistory.create({
      data: {
        postId,
        userId: session?.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Post read created",
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


export const GET = async (request: NextRequest) => {
    const session = await getServerSideSession();
    const userId = session?.user.id as string;
  
    try {
      const url = new URL(request.url);
      const take = Number(url.searchParams.get("take"));
      const lastCursor = url.searchParams.get("lastCursor") as string;
  
      if (!session) {
        return NextResponse.json(
          {
            message: "Unauthenticated, please log in first",
            success: false,
          },
          { status: 400 },
        );
      }
  
      const readingHistories = await db.readingHistory.findMany({
        where: {
          userId: session.user.id,
        },
        take: take ?? 5,
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
  
      if (readingHistories.length === 0) {
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
  
      const lastReadingHistory = readingHistories.at(-1);
      const cursor = lastReadingHistory?.id;
  
      const nextPage = await db.readingHistory.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: take ?? 5,
        skip: 1,
        cursor: {
          id: cursor,
        },
      });
  
      const readingHistoriesWithoutAggregateField = readingHistories.map((readingHistory) => {
        const {
          post: { _count, ...restPost },
          ...restReadingHistory
        } = readingHistory;
  
        return {
          ...restReadingHistory,
          post: {
            ...restPost,
            isUpvoted: _count.upvotes > 0,
            isBookmarked: _count.bookmarks > 0,
          },
        };
      });
  
      const data = {
        data: readingHistoriesWithoutAggregateField,
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
          message: "Internal Server Error",
          success: false,
        },
        { status: 500 },
      );
    }
  };

export const DELETE = async (req: NextRequest) => {
  const session = await getServerSideSession();
  const url = new URL(req.nextUrl);
  const readingHistoryId = url.searchParams.get("readingHistoryId");

  try {
    if (!readingHistoryId) {
      return NextResponse.json(
        {
          message: "Bad Request, missing readingHistoryId",
          success: false,
        },
        { status: 400 },
      );
    }

    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthenticated",
          success: false,
        },
        { status: 401 },
      );
    }

    await db.readingHistory.delete({
      where: {
        id: readingHistoryId,
      },
    });

    return NextResponse.json(
      {
        message: "Reading history deleted",
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
