import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSideSession } from "@/lib/auth";
import { utapi } from "@/utils/uploadthingapi";

type TParams = {
    params: { postId: string }
}

export const DELETE = async (request: NextRequest, { params }: TParams) => {
    const session = await getServerSideSession()
    const postId = params.postId

    try {
        if(!session) {
            return  NextResponse.json({
                 message: "Unauthenticated"
            }, { status: 500 })
        }

        const post = await db.post.findUnique({
            where: {
                id: postId
            },
            include: {
                blog: true
            }
        })

        if(!post) {
            return  NextResponse.json({
                message: "Post not found"
            }, { status: 404 })
        }

        //delete thumbnail if the postt type is blog
        if(post?.blog) {
            const res = await utapi.deleteFiles(post.blog.thumbnail.imageKey)
            console.log(res)
        }

        const deletedPost = await db.post.delete({
            where: {
                id: postId
            }
        })

        return NextResponse.json({
            deletedPost: deletedPost,
            message: "Blog post deleted",
            success: true
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: error
        }, { status: 500 })
    }
}   