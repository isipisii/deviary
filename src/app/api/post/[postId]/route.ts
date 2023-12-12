import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";

type TParams = {
    params: { postId: string }
}

export const DELETE = async (request: NextRequest, { params }: TParams) => {
    const session = await getServerSideSession()
    const postId = params.postId

    try {
        if(!postId) {
           return  NextResponse.json({
                message: "Missing params"
            }, { status: 400 })
        }

        if(!session) {
            return  NextResponse.json({
                 message: "Unauthenticated"
             }, { status: 500 })
         }

        await db.blogPost.delete({
            where: {
                id: postId
            }
        })

        return NextResponse.json({
            message: "Blog post deleted",
            success: true
        }, { status: 204 })

    } catch (error) {
        NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 })
    }
}   

export const GET = async (request: NextRequest, { params }: TParams) => {
    const postId = params.postId

    try {
        if(!postId) {
            return  NextResponse.json({
                 message: "Missing params"
             }, { status: 400 })
        }

        const blogPost = await db.blogPost.findUnique({
            where: {
                id: postId
            }
        })

        if(!blogPost) {
            return  NextResponse.json({
                message: "Blog post not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            data: blogPost,
            success: true
        }, { status: 201 })

    } catch (error) {
        NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 })
    }
}