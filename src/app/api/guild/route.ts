import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSideSession } from "@/lib/auth";
import { utapi } from "@/utils/uploadthingapi";
import { guildSchema } from "@/lib/validators/guild.validator";

export const POST = async (req: NextRequest) => {
    const formData = await req.formData()
    const session = await getServerSideSession()

    const imageFile = formData.get("imageFile") 
    const guildName = formData.get("guildName") 
    const guildDescription = formData.get("guildDescription")
    const isPrivate = formData.get("isPrivate") === "true" ? true : false;
    
    const parsedGuildData = guildSchema.safeParse({
        name: guildName,
        description: guildDescription
    })

    try {
      if(!session) return NextResponse.json({
          success: false,
          message: "Unauthenticated",
      }, { status: 401 })  

      if(!parsedGuildData.success) {
          return NextResponse.json({
              errors: parsedGuildData.error.flatten().fieldErrors,
              message: "Error in guild data.",
          }, { status: 400 })   
      }
      
      const isExisting = await db.guild.findFirst({
          where: {
            name: parsedGuildData.data.name
          }
      })

      if(isExisting) return NextResponse.json({
          success: false,
          message: "Guild name is already taken",
      }, { status: 400 })   

      const { data } = await utapi.uploadFiles(imageFile)
      const createdGuild = await db.guild.create({
          data: {
              name: parsedGuildData.data.name,
              description:parsedGuildData.data.description,
              image: {
                  imageKey: data?.key as string,
                  imageUrl: data?.url as string
              },
              creatorId: session.user.id,
              isPrivate
          }
      })

      // create a member as guild creator
      await db.guildMember.create({
        data: {
          userId: session.user.id,
          guildId: createdGuild.id,
          role: "CREATOR"
        }
      })

      return NextResponse.json({
          success: true,
          guild: createdGuild,
          message: "Guild created",
      }, { status: 200 })   

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error",
        }, { status: 500 })   
    }
}


export const GET = async (req: NextRequest) => {
    const session = await getServerSideSession();
  
    try {
      // get page and lastCursor from query
      const url = new URL(req.url);
  
      const take = Number(url.searchParams.get("take"));
      const lastCursor = url.searchParams.get("lastCursor") as string;
  
      if (!session) {
        return NextResponse.json(
          {
            message: "Unauthenticard, please log in first",
            success: false,
          },
          { status: 401 },
        );
      }
  
      const guilds = await db.guild.findMany({
        take: take ?? 10,
        ...(lastCursor && {
          skip: 1,
          cursor: {
            id: lastCursor,
          },
        }),
        orderBy: {
          createdAt: "desc",
        },
      });
  
      if (guilds.length === 0) {
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
      const lastPostInResults = guilds.at(-1);
      const cursor = lastPostInResults?.id;
  
      const nextPage = await db.guild.findMany({
        take: take ?? 7,
        skip: 1,
        cursor: {
          id: cursor,
        },
      });

      const data = {
        data: guilds,
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