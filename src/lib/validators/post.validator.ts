import z from "zod"

export const blogSchema = z.object({
    title: z.string()
    .min(1, { message: "Title is required" })
    .max(100, {message: "Title should not exceed to 100 characters"}),
})

export const blogSchemaServer = z.object({
    title: z.string()
    .min(1, { message: "Title is required" })
    .max(100, {message: "Title should not exceed to 100 characters"}),
    content: z.string().min(1, { message: "Content is required" }),
    tags: z.string().array().max(10, {message: "Tags should not be more than 10 items"}).nullable()
}) 

export type TDiarySchema = z.infer<typeof diarySchema>

export const diarySchema = z.object({
    title: z.string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title should not exceed to 100 characters"}),
    codeSnippet: z.string().min(1, { message: "Solution is required" }),
    description: z.string().min(1, { message: "Title is required" }),
    solution: z.string().nullable()
})
