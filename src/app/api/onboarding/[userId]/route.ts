import { db } from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"
import { utapi } from "@/utils/uploadthingapi"
import { onboardingSchema } from "@/lib/validators/auth.validator"
import { getServerSideSession } from "@/lib/auth"

export const PATCH = async (request: NextRequest, { params }: { params: { userId: string } }) => {
    const session = await getServerSideSession()
    const body = await request.formData() 
    const userId = params.userId

    const name = body.get("name")
    const bio = body.get("bio")
    const username = body.get("username")
    const imageFile = body.get("imageFile")
    const githubProfileLink = body.get("githubLink")
    const facebookProfileLink = body.get("facebookLink")
    
    let uploadedImage = ""
    
    const parsedOnboardingData = onboardingSchema.safeParse({
        githubLink: githubProfileLink,
        facebookLink: facebookProfileLink,
        name,
        bio,
        username
    })

    try {
        if(!session) return NextResponse.json({
            success: false,
            message: "Unauthenticated, please log in first",
        }, { status: 401 })   

        if(!parsedOnboardingData.success) {
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
                id: session.user.id
            }
        })

        if(!existingUser) return NextResponse.json({
            message: "User not found",
            success: false
        }, { status: 404 })

        const existingUsername = await db.user.findFirst({
            where: {
               username: parsedOnboardingData.data.username
            }
        })

        if(existingUsername) return NextResponse.json({
            message: "This username is already existing",
            success: false
        }, { status: 400 })

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
                name: parsedOnboardingData.data.name || existingUser?.name,
                bio: parsedOnboardingData.data.bio ,
                ...(uploadedImage && { image: uploadedImage}),
                onboarded: true,
                username: parsedOnboardingData.data.username
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

