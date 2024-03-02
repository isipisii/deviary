import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSideSession } from "@/lib/auth";

/**TODO - make the functionality of following a tag in client */

export const PATCH = async (req: NextRequest) => {
  const tag = new URL(req.url).searchParams.get("tag");
  const session = await getServerSideSession();

  try {
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthenticated, please log in first",
        },
        { status: 401 },
      );
    }

    if (!tag) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing tag",
        },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    const isTagExisting = user?.followedTags.some(
      (followedTag) => followedTag === tag,
    );

    if (isTagExisting) {
      return NextResponse.json(
        {
          success: false,
          message: "You are following this tag  already",
        },
        { status: 400 },
      );
    }

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        followedTags: {
          push: tag,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Tag followed",
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

export const DELETE = async (req: NextRequest) => {
  const tag = new URL(req.url).searchParams.get("tag");
  const session = await getServerSideSession();

  try {
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthenticated, please log in first",
        },
        { status: 401 },
      );
    }

    if (!tag) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing tag",
        },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    const isTagExisting = user?.followedTags.some(
      (followedTag) => followedTag === tag,
    );

    if (!isTagExisting) {
      return NextResponse.json(
        {
          success: false,
          message: "You already unfollowed this tag",
        },
        { status: 400 },
      );
    }

    const updatedFollowedTags = user?.followedTags.filter((followedTag) => followedTag !== tag)
    
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        followedTags: updatedFollowedTags
      },
    });

    return NextResponse.json(
      {
        message: "Tag unfollowed",
        successful: true
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
