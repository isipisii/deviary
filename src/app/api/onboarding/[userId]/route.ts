import { db } from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"
import { utapi } from "@/utils/uploadthingapi"

export const PATCH = async (request: NextRequest, { params }: { params: { userId: string } }) => {
    const body = await request.formData() 
    const userId = params.userId

    const name = body.get("name")
    const imageFile = body.get("imageFile")
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

        // update the user's data
        const updatedUser = await db.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                name: name as string ||  existingUser?.name,
                image: uploadedImage || existingUser?.image,
                onboarded: true
            }
        })
        
        return NextResponse.json({
           updatedUser
        })

    } catch (error) {
        console.error(error)
    }
} 

