import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const PATCH = async (request: NextRequest) => {
  const session = await getServerSideSession();
  const userId = session?.user.id as string;
  const url = new URL(request.url);
  const type = url.searchParams.get("filter");

  try {
    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthenticated",
          success: false,
        },
        { status: 401 },
      );
    }

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        feedFilter:
          type === "all"
            ? null
            : {
                postType: type === "code_diary" ? "CODE_DIARY" : "BLOG_POST",
              },
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};

export const GET = async (request: NextRequest) => {
  const session = await getServerSideSession();
  const userId = session?.user.id as string;

  try {
    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthenticated",
          success: false,
        },
        { status: 401 },
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        feedFilter: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { currentFeedFilter: user?.feedFilter?.postType },
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
