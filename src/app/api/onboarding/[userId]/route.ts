import { db } from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"
import { utapi } from "@/utils/uploadthingapi"

export const PATCH = async (request: NextRequest, { params }: { params: { userId: string } }) => {
    const body = await request.formData() 
    const userId = params.userId

    const name = body.get("name")
    const imageFile = body.get("imageFile")
    const githubProfileLink = body.get("githubLink")
    const facebookProfileLink = body.get("facebookLink")
    
    let uploadedImage = ""

    try {
        if (!userId) return NextResponse.json({
            message: "Missing params",
            success: false
         }, { status: 401 })

        const existingUser = await db.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!existingUser) return NextResponse.json({
            message: "User not found",
            success: false
        }, { status: 404})

        if(imageFile) {
            const response = await utapi.uploadFiles(imageFile)
            uploadedImage = response.data?.url as string
        }

        await db.social.upsert({
            where: {
                userId: existingUser.id,
            },
            update: {
                github: githubProfileLink as string,
                facebook: facebookProfileLink as string,
            },
            create: {
                github: githubProfileLink as string,
                facebook: facebookProfileLink as string,
                userId: existingUser.id,
            },
        });

        // update the user's data
        const updatedUser = await db.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                name: name as string ||  existingUser?.name,
                image: uploadedImage || existingUser?.image,
                onboarded: true,
            },
            select: {
                id: true,
                name: true,
                image: true,
                onboarded: true,
                social: true,
                email: true,
            },
        })
        
        return NextResponse.json({
           data: updatedUser,
           message: "Profile updated",
           success: true
        }, { status: 200 })

    } catch (error) {
        NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 })
    }
} 

