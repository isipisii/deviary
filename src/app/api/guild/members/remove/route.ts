import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
    const session = await getServerSideSession()
    const memberId = new URL(req.url).searchParams.get("memberId") as string

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

        if (!memberId) {
            return NextResponse.json(
              {
                success: false,
                message: "Missing guild member id",
              },
              { status: 400 },
            );
        }

        const existingMember = await db.guildMember.findUnique({
            where: {
               id: memberId
            }
        })

        if (!existingMember) {
            return NextResponse.json(
              {
                success: false,
                message: "Member not found",
              },
              { status: 404 },
            );
        }

        await db.guildMember.delete({
            where: {
               id: existingMember.id
            }
        })

        return NextResponse.json({
            message: "Removed successfully",
            success: true
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 })
    }
}