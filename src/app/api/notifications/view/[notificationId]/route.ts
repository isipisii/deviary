import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { notificationId: string } },
) => {
  const notificationId = params.notificationId;
  const session = getServerSideSession();

  try {
    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthenticated",
          success: false,
        },
        { status: 401 },
      );
    }

    await db.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        viewed: true,
      },
    });

    return NextResponse.json(
      {
        message: "Notification viewed",
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
