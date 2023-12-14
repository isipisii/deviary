import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSideSession } from "@/lib/auth";
import { utapi } from "@/utils/uploadthingapi";

type TParams = {
    params: { blogId: string }
}

export const PATCH = async (request: NextRequest, { params }: TParams) => {
    const body = await request.formData()
    const session = await getServerSideSession()
    const blogId = params.blogId

    const title = body.get("title")
    const tags =  body.get("tags")?.toString().split(",")
    const thumbnail = body.get("thumbnail")
    const content = body.get("content")

    let newThumbnail = {
        imageKey: "",
        imageUrl: ""
    }

    try {
        if(!session) {
            return  NextResponse.json({
                 message: "Unauthenticated, please log in first"
             }, { status: 500 })
         }

        const post = await db.post.findUnique({
            where: {
                id: blogId,
                type: "BLOG_POST"
            },
            include: {
                blog: true
            }
        })

        if(!post) {
            return  NextResponse.json({
                message: "Blog post not found"
            }, { status: 404 })
        }

        if(thumbnail) {
            await utapi.deleteFiles(post.blog?.thumbnail.imageKey as string)

            const uploadedNewThumbnail = await utapi.uploadFiles(thumbnail)
            newThumbnail.imageKey = uploadedNewThumbnail.data?.key as string
            newThumbnail.imageUrl = uploadedNewThumbnail.data?.url as string
        }

        const updatedBlogPost = await db.post.update({
            where: {
                id: post.id
            },
            data: {
                tags: tags ?? post.tags,
                blog: {
                    update: {
                        title: title as string ?? post.blog?.title,
                        thumbnail: newThumbnail ?? post.blog?.thumbnail,
                        content: content as string ?? post.blog?.content,
                    },
                },
            },
            include: {
                blog: true
            }
        })


        return NextResponse.json({
            blog: updatedBlogPost,
            message: "Blog post updated",
            success: true
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            error
        }, { status: 500 })
    }
}   

export const GET = async (request: NextRequest, { params }: TParams) => {
    const postId = params.blogId

    try {
        if(!postId) {
            return  NextResponse.json({
                 message: "Missing params"
             }, { status: 400 })
        }

        const post = await db.post.findUnique({
            where: {
                id: postId
            }
        })

        if(!post) {
            return  NextResponse.json({
                message: "Blog post not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            data: post,
            success: true
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            error
        }, { status: 500 })
    }
}