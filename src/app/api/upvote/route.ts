import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSideSession } from "@/lib/auth";

export const POST = async (request: NextRequest) => {
    const url = new URL(request.url)
    const postId = url.searchParams.get("postId")
    const session = await getServerSideSession()
    const userId = session?.user.id as string

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
            }, { status: 400 })
        }

        const existingUpvote = await db.upvote.findFirst({
            where: {
                userId,
                postId 
            }
        })

        if(existingUpvote) {
            return NextResponse.json({
                message: "You have an existing upvote, for this specific post",
                success: false
            }, { status: 400 })
        }

        await db.upvote.create({
            data: {
                userId,
                postId
            }
        })

        //increase the upvote count by 1
        await db.post.update({
            where:{
                id: postId
            },
            data: {
                upvoteCount: {
                    increment: 1
                }
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
    const userId = session?.user.id as string

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

        const existingUpvote =  await db.upvote.findFirst({
            where: {
                userId,
                postId
            }
        })

        if(!existingUpvote) {
            return NextResponse.json({
                message: "You did not upvote this post",
                success: false
            }, { status: 400 })
        }

        await db.upvote.delete({
            where: {
                id: existingUpvote?.id
            }
        })

        //decrease the upvote count by 1
        await db.post.update({
            where: {
                id: postId
            },
            data: {
                upvoteCount: {
                    decrement: 1
                }
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