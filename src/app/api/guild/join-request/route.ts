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

     await db.joinRequest.create({
      data: {
        senderId: session.user.id,
        guildId,
      },
    });

    // send notification to the creator of guild
    // const notification = await db.notification.create({
    //   data: {
    //     joinRequestId: createdJoinRequest.id,
    //     recipientId: guild.creatorId,
    //     type: "JOIN_REQUEST",
    //     senderId: session.user.id,
    //   },
    // });

    // const channel = `channel_user_${notification.recipientId}`;
    // const event = "new-notification";

    // await pusherServer.trigger(channel, event, {
    //   notification,
    // });

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

// remove request
export const DELETE = async (req: NextRequest) => {
  const url = new URL(req.url);
  const joinRequestId = url.searchParams.get("joinRequestId") as string;
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
        id: joinRequestId,
      },
      include: {
        guild: {
          select: {
            creatorId: true,
          },
        },
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

    if (
      existingRequest.senderId !== authenticatedUserId ||
      existingRequest.guild.creatorId !== authenticatedUserId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You cant remove this request",
        },
        { status: 403 },
      );
    }

    await db.joinRequest.delete({
      where: {
        id: joinRequestId,
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
