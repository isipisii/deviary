import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { utapi } from "@/utils/uploadthingapi";
import { getServerSideSession } from "@/lib/auth";
import { blogSchemaServer } from "@/lib/validators/post-validator";
import createNonExistentTags from "@/utils/createNonExistentTags";

export const POST = async (request: NextRequest) => {
    const session = await getServerSideSession()
    const body = await request.formData()

    const title = body.get("title")
    const tags =  body.get("tags")?.toString().split(",") as string[]
    const thumbnail = body.get("thumbnail")
    const content = body.get("content")

    const parsedBlogData = blogSchemaServer.safeParse({
        title,
        content,
        tags
    })

    try {
        if(!session) return NextResponse.json({
            success: false,
            message: "Unauthenticated, please log in first"
        }, { status: 400 })


        if(!parsedBlogData.success) {
            return NextResponse.json({
                errors: parsedBlogData.error.flatten().fieldErrors,
                message: "Error in blog data.",
            }, { status: 400 })   
        }

        await createNonExistentTags(tags)
        const uploadedImage =  await utapi.uploadFiles(thumbnail)
       
        const createdPost = await db.post.create({
            data: {
                type: "BLOG_POST",
                authorId: session.user.id,
                tags,
                blog: {
                    create: {
                        title: parsedBlogData.data.title,
                        content: content as string,
                        thumbnail: {
                            imageKey: uploadedImage.data?.key as string,
                            imageUrl: uploadedImage.data?.url as string
                        }
                    }
                }
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
            }
        })

        
        
        return NextResponse.json({
            data: createdPost,
            message: "Blog post created",
            success: true
        }, { status: 200 })
    
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 })
    }
}
