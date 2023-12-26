import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";

export const GET = async (request: NextRequest) => {
    const session = await getServerSideSession()

    try {
        if(!session){
            return NextResponse.json({
                message: "Unauthenticated, please log in first",
                success: false
            }, { status: 400 })
        }
        
        const bookmarks = await db.bookmark.findMany({
            where: {
                userId: session.user.id
            }
        })

        return NextResponse.json({
            data: bookmarks,
            success: true
        }, { status: 500 })
    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 })
    }
}