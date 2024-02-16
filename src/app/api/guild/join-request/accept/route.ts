import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSideSession } from "@/lib/auth";

// accept the request
export const POST = async (req: NextRequest) => {
  const url = new URL(req.url);
  const joinRequestId = url.searchParams.get("joinRequestId") as string;
  const session = await getServerSideSession();
  const authenticatedUserId = session?.user.id;

  console.log(joinRequestId)

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
    await db.guildMember.create({
      data: {
        userId: existingRequest.senderId,
        guildId: existingRequest.guildId,
      },
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
