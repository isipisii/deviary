import { db } from "@/lib/prisma"

export default async function createNonExistentTags(tags: string[]) {
    const existingTags = await db.tag.findMany({
        where: {
            tagName: {
                in: tags
            },
        },
        select: {
            tagName: true
        }
    })

    if(existingTags.length === 0) {
        await db.tag.createMany({
            data: tags.map((tag) => ({ tagName: tag  })) 
        })
    }

    const nonExistentTags = tags.filter((tag) => (
        !existingTags.some(existingTag => tag === existingTag.tagName)
    ))

    if(nonExistentTags.length > 0) {
        await db.tag.createMany({
            data: nonExistentTags.map((tag) => ({ tagName: tag  })) 
        })
    }

    return
}