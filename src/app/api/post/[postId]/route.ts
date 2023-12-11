import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";

export const DELETE = async (request: NextRequest, { params }: { params: { postId: string }}) => {
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

        return  NextResponse.json({
            message: "Blog post deleted",
            success: true
        }, { status: 204 })

    } catch (error) {
        NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 })
    }
}   