import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSideSession } from "@/lib/auth";

// accept the request
export const POST = async (req: NextRequest) => {
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

    await db.guild.update({
      where: {
        id: existingRequest.guildId,
      },
      data: {
        membersId: {
          push: session.user.id,
        },
      },
    });

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
