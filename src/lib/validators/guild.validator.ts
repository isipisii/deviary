import z from "zod"

export const guildSchema = z.object({
    name: z.string()
    .min(1, { message: "Guild name is required" })
    .max(50, { message: "Guild name should not exceed to 50 characters"}),
    description: z.string().max(500, { message: "Guild name should not exceed to 500 characters"})
})
