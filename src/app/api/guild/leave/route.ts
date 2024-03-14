import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
  const session = await getServerSideSession();
  const guildId = new URL(req.url).searchParams.get("guildId") as string;

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

    if (!guildId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing guild member id",
        },
        { status: 400 },
      );
    }

    const existingMember = await db.guildMember.findFirst({
      where: {
        userId: session.user.id,
        guildId,
      },
    });

    if (!existingMember) {
      return NextResponse.json(
        {
          success: false,
          message: "Member not found",
        },
        { status: 404 },
      );
    }

    // asssign random moderator to become a creator if the creator wants to leave the guild
    if (existingMember.role === "CREATOR") {
      const existingModerators = await db.guildMember.findMany({
        where: {
          guildId,
          role: "MODERATOR",
        },
      });

      if (existingModerators.length === 0) {
        return NextResponse.json(
          {
            message: "Please assign a mod first before you leave.",
            success: false,
          },
          { status: 400 },
        );
      }

      const randomizedIndex = Math.floor(
        Math.random() * existingModerators.length,
      );
      const randomizedMod = existingModerators.at(randomizedIndex);

      await db.guildMember.update({
        where: {
          id: randomizedMod?.id,
        },
        data: {
          role: "CREATOR",
        },
      });
    }

    await db.guildMember.delete({
      where: {
        id: existingMember.id,
      },
    });

    return NextResponse.json(
      {
        message: "Left successfully",
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
