import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { diarySchema } from "@/lib/validators/post-validator";
import { getServerSideSession } from "@/lib/auth";
import { TDiary } from "@/lib/validators/post-validator";

export const POST = async (request: NextRequest) => {
    const session = await getServerSideSession()
    const body = await request.json()
    const  { title, description, solution, codeSnippet, tags } = body as TDiary & { tags: string }
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
            }, { status: 400 })   
        }

        if(!session) return NextResponse.json({
            success: false,
            message: "Unauthenticated, please log in first"
        }, { status: 400 })

        const newDiary = await db.post.create({
            data: {
                tags: tags.split(","),
                type: "CODE_DIARY",
                authorId: "6569d20892aa29abbf2e3705",
                diary: {
                    create: {
                        title: parsedDiaryData.data.title,
                        description: parsedDiaryData.data.description,
                        solution: parsedDiaryData.data.solution,
                        codeSnippet: parsedDiaryData.data.codeSnippet
                    }
                }
            },
            include: {
                diary: true
            }
        })

        return NextResponse.json({
            message: "Diary created",
            success: true,
            data: newDiary
        }, { status: 200 })
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: "Internal Server Error", success: false, error
        }, { status: 500 })

    }
}