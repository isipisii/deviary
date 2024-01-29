import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";

type TParams = {
    params: {
        postId: string
    }
}

export const DELETE = async (request: NextRequest, { params }: TParams) => {
    const session = await getServerSideSession()
    const postId = params.postId

    try {
        if(!session){
            return NextResponse.json({
                message: "Unauthenticated, please log in first",
                success: false
            }, { status: 401 })
        }

        const existingBookmark = await db.bookmark.findFirst({
            where: {
                postId,
                userId: session.user.id
            },
        });

        if (!existingBookmark) {
            return NextResponse.json(
                {
                message: "Post has already been unbookmarked",
                success: false,
                },
                { status: 409 },
            );
        }

        await db.bookmark.delete({
            where: {
                id: existingBookmark.id
            }
        })

        return NextResponse.json({
            message: "Bookmark removed",
            success: true
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 })
    }
}
