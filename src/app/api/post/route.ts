import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { utapi } from "@/utils/uploadthingapi";
import { getServerSideSession } from "@/lib/auth";
import { blogSchema } from "@/lib/validators/post-validator";

export const POST = async (request: NextRequest) => {
    const session = await getServerSideSession()
    const body = await request.formData()

    const title = body.get("title")
    const tags =  body.get("tags")?.toString().split(",")
    const thumbnail = body.get("thumbnail")
    const content = body.get("content")

    const parsedBlogData = blogSchema.safeParse({
        title,
        content
    })

    try {
        if(!session) return NextResponse.json({
            success: false,
            message: "Unauthenticated, please log in first"
        }, { status: 400 })


        if(!parsedBlogData.success) {
            return NextResponse.json({
                errors: parsedBlogData.error.flatten().fieldErrors,
                message: "Error in onboarding data.",
            }, { status: 400 })   
        }

        const uploadedImage =  await utapi.uploadFiles(thumbnail)
       
        const createdPost = await db.blogPost.create({
            data: {
                authorId: session.user.id,
                type: "BLOG_POST",
                tags,
                title: parsedBlogData.data.title,
                content: parsedBlogData.data.content,
                thumbnail: {
                    imageKey: uploadedImage.data?.key as string,
                    imageUrl: uploadedImage.data?.url as string
                }
            }
        })
        
        return NextResponse.json({
            data: createdPost,
            message: "Blog post created",
            success: true
        }, { status: 200 })
    
    } catch (error) {
        NextResponse.json({ message: "Internal Server Error", success: false }, {status: 500})
    }
}

