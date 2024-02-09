import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    const session = await getServerSideSession()

    try {
        if(!session) return NextResponse.json({
            success: false,
            message: "Unauthenticated",
        }, { status: 401 })  

        const userGuilds = await db.guildMember.findMany({
            where: {
                userId: session.user.id
            },
            select: {
                guild: true
            }
        })
        
        return NextResponse.json({
            guilds: userGuilds,
            success: true
        }, {
            status: 200
        })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, {
            status: 500
        })
    }
}