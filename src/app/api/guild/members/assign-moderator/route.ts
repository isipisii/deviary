import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { checkIfGuildCreator } from "@/utils/checkGuildActionsEligibility";
import { NextResponse, NextRequest } from "next/server";

export const PATCH = async (req: NextRequest) => {
    const session = await getServerSideSession()
    const url = new URL(req.url)
    const guildId = url.searchParams.get("guildId")
    const memberId = url.searchParams.get("memberId")

    try {
        if (!session) {
            return NextResponse.json(
              {
                success: false,
                message: "Unauthenticated",
              },
              { status: 401 },
            );
          }

        if(!guildId) {
            return NextResponse.json({
                message: "Missing guild id",
                success: false
            }, { status: 400 })
        }

        if(!memberId) {
            return NextResponse.json({
                message: "Missing member id",
                success: false
            }, { status: 400 })
        }

        const isGuildCreator = await checkIfGuildCreator(session?.user.id, guildId)

        if(!isGuildCreator) {
            return NextResponse.json({
                message: "Forbidden, you are unauthorized to make this action",
                success: false
            }, { status: 403 })
        }


        const existingMember = await db.guildMember.findUnique({
            where: {
                id: memberId
            }
        })
        
        if(!existingMember) {
            return NextResponse.json({
                message: "Member not found",
                success: false
            }, { status: 404 })
        }

        if(existingMember.guildId !== guildId) {
            return NextResponse.json({
                message: "Member is not a member of the guild",
                success: false
            }, { status: 400 })
        }

        await db.guildMember.update({
            where: {
                id: existingMember.id 
            }, 
            data: {
                role: "MODERATOR"
            }
        })

        return NextResponse.json({
            message: "Member was succesfully assigned as moderator",
            success: true
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            success: false
        }, { status: 500 })
    }
}