import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";
import { checkIfGuildMember } from "@/utils/checkGuildActionsEligibility";

export const POST = async (req: NextRequest) => {
    const session = await getServerSideSession()
    const url = new URL(req.url)
    const guildId = url.searchParams.get("guildId")
    const postId = url.searchParams.get("postId")
    const { content } = await req.json() as { content: string }

    try {
        if(!session) {
            return NextResponse.json({
                message: "Unauthenticated",
                success: false
            }, { status: 401 })
        }

        if(!guildId) {
            return NextResponse.json({
                message: "Missing guild id",
                success: false
            }, { status: 400 })
        }
        
        if(!postId) {
            return NextResponse.json({
                message: "Missing post id",
                success: false
            }, { status: 400 })
        }

        const userId = session.user.id
        const isGuildMember = await checkIfGuildMember(userId, guildId)

        if(!isGuildMember) {
            return NextResponse.json({
                message: "Unauthorized, you're not a member of the guild",
                success: false
            }, { status: 403 })
        }

        await db.guildShare.create({
            data: {
                content,
                postId,
                guildId,
                userId: userId
            }
        })
        
        return NextResponse.json({
            message: "Post has been shared",
            success: true
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 })
    }
}

export const PATCH = async (req: NextRequest) => {
    const session = await getServerSideSession()
    const url = new URL(req.url)
    const shareId = url.searchParams.get("shareId")
    const { content } = await req.json() as { content: string }

    try {
        if(!session) {
            return NextResponse.json({
                message: "Unauthenticated",
                success: false
            }, { status: 401 })
        }

        if(!shareId) {
            return NextResponse.json({
                message: "Missing guild id",
                success: false
            }, { status: 400 })
        }
    
        await db.guildShare.update({
            where: {
                id: shareId
            },
            data: {
                content
            }
        })
        
        return NextResponse.json({
            message: "Shared post edited",
            success: true
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 })
    }
}

export const DELETE = async (req: NextRequest) => {
    const session = await getServerSideSession()
    const url = new URL(req.url)
    const shareId = url.searchParams.get("shareId")

    try {
        if(!session) {
            return NextResponse.json({
                message: "Unauthenticated",
                success: false
            }, { status: 401 })
        }

        if(!shareId) {
            return NextResponse.json({
                message: "Missing share id",
                success: false
            }, { status: 400 })
        }

        await db.guildShare.delete({
          where: {
            id: shareId
          }
        })
        
        return NextResponse.json({
            message: "Share deleted",
            success: true
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 })
    }
}