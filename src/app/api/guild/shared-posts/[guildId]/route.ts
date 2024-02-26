import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

const userSelectedFields = {
  name: true,
  id: true,
  image: true,
  email: true
}

export const GET = async (req: NextRequest, { params }: {params: { guildId: string }}) => {
    const session = await getServerSideSession();
    const guildId = params.guildId

    try {
      // get page and lastCursor from query
      const url = new URL(req.url);
      const take = Number(url.searchParams.get("take"));
      const lastCursor = url.searchParams.get("lastCursor") as string;
  
      if (!session) {
        return NextResponse.json(
          {
            message: "Unauthenticated, please log in first",
            success: false,
          },
          { status: 401 },
        );
      }

      const guildSharedPosts = await db.guildShare.findMany({
        where: {
          guildId
        },
        take: take ? Number(take) : 10,
        ...(lastCursor && {
          skip: 1,
          cursor: {
            id: lastCursor,
          },
        }),
        orderBy: {
          createdAt: "desc",
        },
        include: {
          guild: true,
          user: {
            select: {
              ...userSelectedFields
            }
          },
          post: {
            include: {
              blog: true,
              diary: true
            }
          }
        }
      })
  
      if (guildSharedPosts.length === 0) {
        return NextResponse.json(
          {
            data: [],
            metaData: {
              lastCursor: null,
              hasNextPage: false,
            },
          },
          { status: 200 },
        );
      }
  
      //gets the last post's id to use in getting the next page
      const lastSharedPostInResults = guildSharedPosts.at(-1);
      const cursor = lastSharedPostInResults?.id;
  
      const nextPage = await db.guildShare.findMany({
        where: {
          guildId
        },
        take: take ? Number(take) : 10,
        skip: 1,
        orderBy: {
          createdAt: "desc",
        },
        cursor: {
          id: cursor,
        },
      });
  
      const data = {
        data: guildSharedPosts,
        metaData: {
          lastCursor: cursor,
          hasNextPage: nextPage.length > 0,
        },
      };
  
      return NextResponse.json({ data, success: true }, { status: 200 });
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