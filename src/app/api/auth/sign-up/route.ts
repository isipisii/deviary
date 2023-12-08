import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { signUpSchema } from "@/lib/validators/auth-validator";
import z from "zod";

type TSignUpSchema = z.infer<typeof signUpSchema>
//creates new user
export const POST = async (request: NextRequest) => {
    const body: TSignUpSchema= await request.json()
    const { email, password: rawPassword, confirmPassword } = body
    
    const signUpCredentials = signUpSchema.safeParse({
        email,
        password: rawPassword,
        confirmPassword
    })

    try {
        if(!signUpCredentials.success) {
            return NextResponse.json({
                errors: signUpCredentials.error.flatten().fieldErrors,
                message: "Error in sign up credentials.",
            }, { status: 400 })   
        }

        const existingUserEmail = await db.user.findUnique({
            where: {
                email
            }
        })

        if(existingUserEmail) {
            return NextResponse.json({
                success: false,
                message: "The email you provided is already existing",
            }, { status: 400 })
        }

        const hashedPassword = await argon2.hash(rawPassword)

        const user = await db.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        })

        return NextResponse.json({
            data: user,
            message: "Account created",
            success: false
        }, { status: 201 })

    } catch (error) {
        NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}
