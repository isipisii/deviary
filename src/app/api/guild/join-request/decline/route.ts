import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";

// remove request for the user who made the req
export const DELETE = async (req: NextRequest) => {
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

      await db.joinRequest.delete({
        where: {
          id: joinRequestId
        },
      });
  
      return NextResponse.json(
        {
          success: true,
          message: "Join request remove",
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
  