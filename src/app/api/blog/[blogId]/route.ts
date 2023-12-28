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

    let newThumbnail = null

    try {
        if(!session) {
            return  NextResponse.json({
                 message: "Unauthenticated, please log in first"
             }, { status: 500 })
         }

        const post = await db.post.findUnique({
            where: {
                id: blogId,
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
            newThumbnail = {
                imageKey: uploadedNewThumbnail.data?.key as string,
                imageUrl: uploadedNewThumbnail.data?.url as string
            }
        }

        const updatedBlogPost = await db.post.update({
            where: {
                id: post.id
            },
            data: {
                tags,
                blog: {
                    update: {
                        title: title as string,
                        thumbnail: {
                            update: {
                                imageKey:  newThumbnail?.imageKey ?? post.blog?.thumbnail.imageKey,
                                imageUrl:  newThumbnail?.imageUrl ?? post.blog?.thumbnail.imageUrl
                            }
                        },
                        content: content as string ,
                    },
                },
            },
            include: {
                blog: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
        })


        return NextResponse.json({
            data: updatedBlogPost,
            message: "Blog post updated",
            success: true
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            error
        }, { status: 500 })
    }
}   
