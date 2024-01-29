import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSideSession } from "@/lib/auth";
import { getPusherInstance } from "@/lib/pusher/server";
import { userSelectedFields } from "../notifications/route";

const pusherServer = getPusherInstance();

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
            }, { status: 401 })
        }

        if(!postId) {
            return NextResponse.json({
                message: "Missing post id"
            }, { status: 400 })
        }

        const post = await db.post.findUnique({
            where: {
                id: postId
            }
        })

        if(!post) {
            return NextResponse.json({
                message: "Post not found"
            }, { status: 404 })
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

        const notification = await db.notification.create({
            data:{
                recipientId: post.authorId,
                senderId: userId,
                postId,
                type: "UPVOTE"
            },
            include: {
                sender: {
                    select: {
                       ...userSelectedFields
                    }
                },
                post: {
                    include: {
                        blog: true,
                        diary: true,
                        author: {
                            select: {
                                ...userSelectedFields
                            }
                        }
                    }
                }
            }
        })

        const channel = `channel_user_${notification.recipientId}`;
        const event = "new-notification";

        await pusherServer.trigger(channel, event, {
           notification
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
            }, { status: 401 })
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
        
        const existingNotification = await db.notification.findFirst({
            where: {
                senderId: userId,
                postId
            }
        })

        if (existingNotification) {
            await db.notification.delete({
                where: {
                    id: existingNotification.id
                }
             })
        }

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