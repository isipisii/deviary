import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } },
) => {
  const userId = params.userId;

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        bio: true,
        name: true,
        email: true,
        image: true,
        id: true
      }
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        user,
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
