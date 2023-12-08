import z from "zod"

export const postSchema = z.object({
    title: z.string()
    .min(1, { message: "Title is required" })
    .max(100, {message: "Title should not exceed to 100 characters"}),
    tags: z.array(z.string()),
    postBody: z.string().min(1, {message: "Body is required"})
})