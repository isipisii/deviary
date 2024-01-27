import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";

// TODO: create a ui for the notificatio tommorrow
export const GET = async () => {
  const session = await getServerSideSession();

  try {
    if (!session) {
      return NextResponse.json(
        { message: "Unauthenticated", success: false },
        { status: 401 },
      );
    }

    const notifications = await db.notification.findMany({
      where: {
        recipientId: session.user.id,
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
        post: {
          include: {
            blog: true,
            diary: true,
          },
        },
      },
    });

    return NextResponse.json({ notifications, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 },
    );
  }
};
