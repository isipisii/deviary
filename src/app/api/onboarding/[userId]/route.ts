import { db } from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"
import { onboardingSchema } from "@/lib/validators/auth-validator"
import z from "zod"
import { getServerSideSession } from "@/lib/auth"
import { utapi } from "@/utils/uploadthingapi"

type TOnboardingSchema = z.infer<typeof onboardingSchema>

type TTest = {
    name: string
    imageFile: File
}

export const POST = async (request: NextRequest, { params }: { params: { userId: string } }) => {
    const body = await request.formData() 

    const name = body.get("name")
    const imageFile = body.get("imageFile")

    // TODO TOM: CREATE AN IMAGE UPLOAD IN CLIENT. dont use the upload thing's uploader
    try {

        const response = await utapi.uploadFiles(imageFile)
        const uploadedImage = response.data?.url

        const updatedUser = await db.user.update({
            where: {
                id: params.userId,
            },
            data: {
                name: name as string,
                image: uploadedImage
            }
        })
        
        return NextResponse.json({
           updatedUser
        })

    } catch (error) {
        console.error(error)
    }
} 