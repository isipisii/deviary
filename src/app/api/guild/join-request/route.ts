import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";
import { getPusherInstance } from "@/lib/pusher/server";

const pusherServer = getPusherInstance();

// create a join request to a specific guild
export const POST = async (req: NextRequest) => {
  const url = new URL(req.url);
  const guildId = url.searchParams.get("guildId") as string;
  const session = await getServerSideSession();

  try {
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthenticated",
        },
        { status: 401 },
      );
    }

    const existingRequest = await db.joinRequest.findFirst({
      where: {
        senderId: session.user.id,
        guildId,
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "You have an existing request",
        },
        { status: 400 },
      );
    }

    const guild = await db.guild.findUnique({
      where: {
        id: guildId,
      },
    });

    if (!guild) {
      return NextResponse.json(
        {
          success: false,
          message: "Guild not found",
        },
        { status: 404 },
      );
    }

    const createdJoinRequest = await db.joinRequest.create({
      data: {
        senderId: session.user.id,
        guildId,
      },
    });

    //send notification to the creator of guild
    const notification = await db.notification.create({
      data: {
        joinRequestId: createdJoinRequest.id,
        recipientId: guild.creatorId,
        type: "JOIN_REQUEST",
        senderId: session.user.id,
      },
    });

    const channel = `channel_user_${notification.recipientId}`;
    const event = "new-notification";

    await pusherServer.trigger(channel, event, {
      notification,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Join request submitted",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};

// remove request for the user who made the req
export const DELETE = async (req: NextRequest) => {
  const url = new URL(req.url);
  const guildId = url.searchParams.get("guildId") as string;
  const session = await getServerSideSession();

  try {
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthenticated",
        },
        { status: 401 },
      );
    }

    const authenticatedUserId = session.user.id;

    const existingRequest = await db.joinRequest.findFirst({
      where: {
        senderId: authenticatedUserId,
        guildId,
      },
    });

    if (!existingRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "You dont have an existing request",
        },
        { status: 400 },
      );
    }

    await db.joinRequest.delete({
      where: {
        id: existingRequest.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Join request remove",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};

export const GET = async (req: NextRequest) => {
  const url = new URL(req.nextUrl);
  const guildId = url.searchParams.get("guildId");
  const lastCursor = url.searchParams.get("lastCursor");
  const take = url.searchParams.get("take");

  try {
    if (!guildId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing guild id",
        },
        { status: 400 },
      );
    }

    const joinRequests = await db.joinRequest.findMany({
      where: {
        guildId,
      },
      take: take ? Number(take) : 10,
      ...(lastCursor && {
        cursor: {
          id: lastCursor,
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          select: {
            name: true,
            id: true,
            createdAt: true,
            image: true,
            email: true,
          },
        },
      },
    });

    if (joinRequests.length === 0) {
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

    const lastJoinRequest = joinRequests.at(-1);
    const cursor = lastJoinRequest?.id;

    const nextPage = await db.joinRequest.findMany({
      where: {
        guildId,
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

    const data = {
      data: joinRequests,
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
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};
