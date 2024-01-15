import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma";

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") as string;

  try {
    const tags = await db.tag.findMany({
      where: {
        tagName: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        tagName: true
      }
    })

    return NextResponse.json(
      { tags },
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
