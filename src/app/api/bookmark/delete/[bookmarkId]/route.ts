import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";

type TParams = {
    params: {
        bookmarkId: string
    }
}

export const DELETE = async (request: NextRequest, { params }: TParams) => {
    const session = await getServerSideSession()
    const bookmarkId = params.bookmarkId

    try {
        if(!session){
            return NextResponse.json({
                message: "Unauthenticated, please log in first",
                success: false
            }, { status: 400 })
        }
        
        await db.bookmark.delete({
            where: {
                id: bookmarkId
            }
        })

        return NextResponse.json({
            message: "Bookmark removed",
            success: true
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 })
    }
}
