import z from "zod"

export const blogSchema = z.object({
    title: z.string()
    .min(1, { message: "Title is required" })
    .max(100, {message: "Title should not exceed to 100 characters"}),
})

export type TDiary = z.infer<typeof diarySchema>
export const diarySchema = z.object({
    title: z.string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title should not exceed to 100 characters"}),
    codeSnippet: z.string().min(1, { message: "Code snippet is required" }),
    description: z.string().nullable(),
    solution: z.string().min(1, { message: "Solution is required" })
})
