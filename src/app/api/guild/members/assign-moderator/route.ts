import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getPusherInstance } from "@/lib/pusher/server";
import { checkIfGuildCreator } from "@/utils/checkGuildActionsEligibility";
import { NextResponse, NextRequest } from "next/server";

const pusherServer = getPusherInstance()

export const POST = async (req: NextRequest) => {
  const session = await getServerSideSession();
  const url = new URL(req.url);
  const guildId = url.searchParams.get("guildId");
  const memberId = url.searchParams.get("memberId");

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
    const authenticatedUserId = session?.user.id;

    if (!guildId) {
      return NextResponse.json(
        {
          message: "Missing guild id",
          success: false,
        },
        { status: 400 },
      );
    }

    if (!memberId) {
      return NextResponse.json(
        {
          message: "Missing member id",
          success: false,
        },
        { status: 400 },
      );
    }

    const isGuildCreator = await checkIfGuildCreator(session?.user.id, guildId);

    if (!isGuildCreator) {
      return NextResponse.json(
        {
          message: "Forbidden, you are unauthorized to make this action",
          success: false,
        },
        { status: 403 },
      );
    }

    const existingMember = await db.guildMember.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!existingMember) {
      return NextResponse.json(
        {
          message: "This user is not a member of the guild",
          success: false,
        },
        { status: 404 },
      );
    }

    const assignedModerator = await db.guildMember.update({
      where: {
        id: existingMember.id,
      },
      data: {
        role: "MODERATOR",
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
        guildId,
        recipientId: assignedModerator.user.id,
        senderId: authenticatedUserId,
        type: "ASSIGN_MOD",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        guild: true,
      },
    });

    const channel = `channel_user_${notification.recipientId}`;
    const event = "new-notification";

    await pusherServer.trigger(channel, event, {
      notification,
    });

    return NextResponse.json(
      {
        message: "Member was succesfully assigned as moderator",
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
  const url = new URL(req.url);
  const memberId = url.searchParams.get("memberId");

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

    if (!memberId) {
      return NextResponse.json(
        {
          message: "Missing member id",
          success: false,
        },
        { status: 400 },
      );
    }

    const existingMember = await db.guildMember.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!existingMember) {
      return NextResponse.json(
        {
          message: "This user is not a member of the guild",
          success: false,
        },
        { status: 404 },
      );
    }

    await db.guildMember.update({
      where: {
        id: existingMember.id,
      },
      data: {
        role: "MEMBER",
      },
    });

    return NextResponse.json(
      {
        message: "Moderator was succesfully removed",
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
