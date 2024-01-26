import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";

type TParams = {
    params: { notificationId: string };
 };
  
export const DELETE = async (req: NextRequest, { params }: TParams ) => {
  const session = await getServerSideSession();
  const notificationId = params.notificationId

  try {
    if (!session) {
      return NextResponse.json(
        { message: "Unauthenticated", success: false },
        { status: 401 },
      );
    }

    await db.notification.delete({
      where: {
        id: notificationId
      },
    });

    return NextResponse.json(
      { message: "Notification deleted", success: true },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 },
    );
  }
};
