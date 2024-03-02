import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest) => {
    const session = await getServerSideSession()
    const guildId = new URL(req.url).searchParams.get("guildId") as string

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
               guildId
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
            message: "Left successfully",
            success: true
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 })
    }
}