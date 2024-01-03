import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";

export const GET = async (request: NextRequest) => {
    const session = await getServerSideSession()

    try {
        const url = new URL(request.url)
        const take = Number(url.searchParams.get("take"));
        const lastCursor = url.searchParams.get("lastCursor") as string;

        if(!session){
            return NextResponse.json({
                message: "Unauthenticated, please log in first",
                success: false
            }, { status: 400 })
        }
        
        const bookmarks = await db.bookmark.findMany({
            where: {
                userId: session.user.id
            },
            take: take ?? 5,
            ...(lastCursor && {
                skip: 1,
                cursor: {
                    id: lastCursor
                }
            }),
            orderBy: {
                createdAt: "desc"
            },
            include: {
                post: {
                    include:{
                        blog: true,
                        diary: true,
                        author: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true
                            }
                        }
                    },
                },
            }
        })

        if (bookmarks.length === 0) {
            return NextResponse.json({
                data: [],
                metaData: {
                    lastCursor: null,
                    hasNextPage: false,
                },
            }, { status: 200 })
        }
        
        const lastBookmark = bookmarks.at(-1)
        const cursor = lastBookmark?.id

        const nextPage = await db.post.findMany({
            take: take ?? 5,
            skip: 1,
            cursor: {
              id: cursor,
            },
        });

        const bookmarksWithIsBookmarkedField = bookmarks.map(bookmark => (
            {...bookmark, post: {...bookmark.post, isBookmarked: true, bookmarkId: bookmark.id}}
        ))

        const data = {
            data: bookmarksWithIsBookmarkedField,
            metaData: {
                lastCursor: cursor,
                hasNextPage: nextPage.length > 0,
            },
        }

        return NextResponse.json({
            data,
            success: true
        }, { status: 200 })
        
    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 })
    }
}