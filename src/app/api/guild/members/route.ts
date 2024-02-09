import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const guildId = url.searchParams.get("guildId") as string;
  const take = url.searchParams.get("take");
  const lastCursor = url.searchParams.get("lastCursor");

  try {
    const guildMembers = await db.guildMember.findMany({
      where: {
        guildId,
      },
      take: take ? Number(take) : 10,
      //same as with the filter
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
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

    if (guildMembers.length === 0) {
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

    const lastGuildMember = guildMembers.at(-1);
    const cursor = lastGuildMember?.id;

    const nextPage = await db.guildMember.findMany({
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
      data: guildMembers,
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
        message: "Internal Server Error",
        success: false,
      },
      {
        status: 500,
      },
    );
  }
};
