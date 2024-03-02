import { db } from "@/lib/prisma";

export async function checkIfGuildCreator(userId: string, guildId: string) {
    const existingMember = await db.guildMember.findFirst({
        where: {
            userId,
            guildId
        }
    })
    
    if(!existingMember) {
        throw new Error("Member not found");
    }

    if(existingMember.role === "CREATOR") {
        return true
    }

    return false
}

export async function checkIfGuildModerator(userId: string, guildId: string) {
    const existingMember = await db.guildMember.findFirst({
        where: {
            userId,
            guildId
        }
    })
    
    if(!existingMember) {
        throw new Error("Member not found");
    }

    if(existingMember.role === "MODERATOR") {
        return true
    }

    return false
}

export async function checkIfGuildMember(userId: string, guildId: string) {
    const existingMember = await db.guildMember.findFirst({
        where: {
            userId,
            guildId
        }
    })

    if(existingMember) {
        return true
    }

    return false
}