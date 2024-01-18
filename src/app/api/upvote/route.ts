import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSideSession } from "@/lib/auth";

export const POST = async (request: NextRequest) => {
    const url = new URL(request.url)
    const postId = url.searchParams.get("postId")
    const session = await getServerSideSession()

    try {
        if(!session) {
            return NextResponse.json({
                message: "Unauthenticated, please log in first",
                success: false
            }, { status: 400 })
        }

        if(!postId) {
            return NextResponse.json({
                message: "Missing post id"
            }, { status: 201 })
        }

        await db.upvote.create({
            data: {
                userId: session?.user.id,
                postId
            }
        })

        return NextResponse.json({
            message: "Post upvoted"
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 })
    }
}

export const DELETE = async (request: NextRequest) => {
    const url = new URL(request.url)
    const postId = url.searchParams.get("postId")
    const session = await getServerSideSession()

    try {
        if(!session) {
            return NextResponse.json({
                message: "Unauthenticated, please log in first",
                success: false
            }, { status: 400 })
        }
        

        if(!postId) {
            return NextResponse.json({
                message: "Missing post id"
            }, { status: 201 })
        }

        const upvote =  await db.upvote.findFirst({
            where: {
                userId: session.user.id,
                postId
            }
        })

        await db.upvote.delete({
            where: {
                id: upvote?.id
            }
        })

        return NextResponse.json({
            message: "Upvote removed"
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 })
    }
}