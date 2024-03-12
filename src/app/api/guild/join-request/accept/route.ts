import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSideSession } from "@/lib/auth";
import { getPusherInstance } from "@/lib/pusher/server";

const pusherServer = getPusherInstance()

// accept the request
export const POST = async (req: NextRequest) => {
  const url = new URL(req.url);
  const joinRequestId = url.searchParams.get("joinRequestId") as string;
  const session = await getServerSideSession();
  const authenticatedUserId = session?.user.id;

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

    if (!joinRequestId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing join request id",
        },
        { status: 400 },
      );
    }

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
          message: "This request is not existing",
        },
        { status: 400 },
      );
    }

    if (existingRequest.guild.creatorId !== authenticatedUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "You cant accept this request",
        },
        { status: 403 },
      );
    }

    // create a new guild member
    const newGuildMember = await db.guildMember.create({
      data: {
        userId: existingRequest.senderId,
        guildId: existingRequest.guildId,
      },
      include: {
        user: {
          select: {
            id: true
          }
        }
      }
    });

    const notification = await db.notification.create({
      data: {
        recipientId: newGuildMember.user.id,
        senderId: authenticatedUserId,
        type: "JOIN_REQUEST_ACCEPTED",
        guildId: newGuildMember.guildId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        guild: true,
      }
    })

    const channel = `channel_user_${notification.recipientId}`;
    const event = "new-notification";

    await pusherServer.trigger(channel, event, {
      notification,
    });

    // delete the join request
    await db.joinRequest.delete({
      where: {
        id: existingRequest.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Join request accepted",
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
