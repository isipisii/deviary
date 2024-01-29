import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { TDiarySchema, diarySchema } from "@/lib/validators/post-validator";
import { getServerSideSession } from "@/lib/auth";

type TParams = { 
    params: {
        diaryId: string
    }
}
export const PATCH = async (request: NextRequest, { params }: TParams) => {
    const session = await getServerSideSession()
    const { title, description, solution, codeSnippet, tags } = await request.json() as TDiarySchema & { tags: string }
    const diaryId = params.diaryId
    const parsedDiaryData = diarySchema.safeParse({
        title,
        description,
        solution,
        codeSnippet
    })

    try {
        if(!parsedDiaryData.success) {
            return NextResponse.json({
                errors: parsedDiaryData.error.flatten().fieldErrors,
                message: "Error in diary data.",
            }, { status: 401 })   
        }

        if(!session) return NextResponse.json({
            success: false,
            message: "Unauthenticated, please log in first"
        }, { status: 400 })
        
        const updatedDiary = await db.post.update({
            where: {
                id: diaryId
            }, 
            data: {
                tags: tags.split(","),
                diary: {
                    update: {
                        title: parsedDiaryData.data.title,
                        description: parsedDiaryData.data.description,
                        solution: parsedDiaryData.data.solution,
                        codeSnippet: parsedDiaryData.data.codeSnippet
                    }
                }
            },
            include: {
                diary: true,
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
            message: "Updated created",
            success: true,
            data: updatedDiary
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            error
        }, { status: 500 })
    }
}