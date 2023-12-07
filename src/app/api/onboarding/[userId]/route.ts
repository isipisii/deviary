import { db } from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"
import { utapi } from "@/utils/uploadthingapi"
import { onboardingSchema } from "@/lib/validators/auth-validator"
import { getServerSideSession } from "@/lib/auth"

export const PATCH = async (request: NextRequest, { params }: { params: { userId: string } }) => {
    const session = getServerSideSession()
    const body = await request.formData() 
    const userId = params.userId

    const name = body.get("name")
    const imageFile = body.get("imageFile")
    const githubProfileLink = body.get("githubLink")
    const facebookProfileLink = body.get("facebookLink")
    
    let uploadedImage = ""
    
    const parsedOnboardingData = onboardingSchema.safeParse({
        githubLink: githubProfileLink,
        facebookLink: facebookProfileLink,
        name: name
    })

    try {

        if(!session) return NextResponse.json({
            success: false,
            message: "Unauthenticated, please log in first",
        }, { status: 400 })   

        if(!parsedOnboardingData.success) {
            console.log(parsedOnboardingData.error)
            return NextResponse.json({
                errors: parsedOnboardingData.error.flatten().fieldErrors,
                message: "Error in onboarding data.",
            }, { status: 400 })   
        }

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
        }, { status: 404 })

        if(imageFile) {
            const response = await utapi.uploadFiles(imageFile)
            uploadedImage = response.data?.url as string
        }

        //updates existing document, otherwise create a new one
        await db.social.upsert({
            where: {
                userId: existingUser.id,
            },
            update: {
                github: parsedOnboardingData.data.githubLink,
                facebook: parsedOnboardingData.data.facebookLink,
            },
            create: {
                github: parsedOnboardingData.data.githubLink,
                facebook: parsedOnboardingData.data.facebookLink,
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
                email: true,
                social: true,
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

