import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";

type TParams = {
    params: {
        postId: string
    }
}

export const POST = async (request: NextRequest, { params }: TParams) => {
    const session = await getServerSideSession()
    const postId = params.postId
    
    try {
        if(!session){
            return NextResponse.json({
                message: "Unauthenticated, please log in first",
                success: false
            }, { status: 400 })
        }

        const createdBookmark = await db.bookmark.create({
            data: {
                postId,
                userId: session?.user.id as string
            }
        })

        return NextResponse.json({
            data: createdBookmark,
            message: "Bookmark created",
            success: true
        }, { status: 500 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 })
    }
}
