import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// todo
export const POST = async (request: NextRequest) => {
    // const {} = await request.
    try {
        const user = await prisma.user.create({
            data: {
                email: "testemail",
                password: "123",
                name: "Alessandro"   
            }
        })

        return NextResponse.json({
            user
        }, { status: 201 })

    } catch (error) {
        NextResponse.json({
            message: "Internal Server Error"
        }, {status: 500})
    }
}

export const GET = async (request: NextRequest) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
              name: 'Alessandro',
            },
          })

        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            ...user
        }, { status: 201 })

    } catch (error) {
        NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 })
    }
}