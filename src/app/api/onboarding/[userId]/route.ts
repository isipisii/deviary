import { db } from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"
import { onboardingSchema } from "@/lib/validators/auth-validator"
import z from "zod"
import { getServerSideSession } from "@/lib/auth"

type TOnboardingSchema = z.infer<typeof onboardingSchema>

export const POST = async (request: NextRequest, { params }: { params: { userId: string } }) => {
    const body: TOnboardingSchema = await request.json()
    const { name, image } = body

    try {
        const updatedUser = await db.user.update({
            where: {
                id: params.userId,
            },
            data: {
                name,
                image
              },
        })
        
        return NextResponse.json({
           updatedUser
        })

    } catch (error) {
        console.error(error)
    }
} 