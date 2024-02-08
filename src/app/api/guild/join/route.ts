import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

//this is for public guilds
export const POST = async (req: NextRequest) => {
  const url = new URL(req.url);
  const session = await getServerSideSession();
  const guildId = url.searchParams.get("guildId");

  try {
    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthenticated, please log in first",
          success: false,
        },
        { status: 401 },
      );
    }

    if (!guildId) {
      return NextResponse.json(
        {
          message: "Missing guild id",
          success: false,
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
          message: "Guild not found",
          success: false,
        },
        { status: 404 },
      );
    }

    if (guild.isPrivate) {
      return NextResponse.json(
        {
          message: "You cannot join to this guild",
          success: false,
        },
        { status: 400 },
      );
    }

    await db.guildMember.create({
      data: {
        userId: session.user.id,
        guildId
      }
    })

    return NextResponse.json(
      {
        message: "Joined",
        successs: true,
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
