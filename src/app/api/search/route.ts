import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";


export const GET = async (request: NextRequest) => {
    const url = new URL(request.url)
    const query = decodeURI(url.searchParams.get("query") as string).trim()
    const lastCursor = url.searchParams.get("lastCursor") as string
    const take = Number(url.searchParams.get("take"))

    try {
        if(!query) {
            return NextResponse.json(
                { message: "Missing search params"},
                { status: 400 },
            );
        }

        const posts = await db.post.findMany({
            where: {
                OR: [
                    {
                        blog: {
                            title: {
                                contains: query,
                                mode: "insensitive"
                            }
                        }
                    },
                    {
                        diary: {
                            title: {
                                contains: query,
                                mode: "insensitive"
                            }
                        }
                    },

                ]    
            },
            include: {
                blog: true,
                diary: true
            },
              take: take ?? 5,
            ...(lastCursor && {
                skip: 1,
                cursor: {
                    id: lastCursor
                }
            }),
        })


        return NextResponse.json(
            { message: "Internal Server Error", posts},
            { status: 200 },
        );

    } catch (error) {
        return NextResponse.json(
            {
              error,
              message: "Internal Server Error",
            },
            { status: 500 },
        );
    }   
}