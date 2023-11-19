import z from "zod"

export const signInSchema = z.object({
    email: z.string()
    .min(1, { message: "Email is required" })
    .email(),
    password: z.string()
    .min(8, "Password must be atleast 8 characters")
    .max(30, "Password should not exceed to 30 characters")
})

export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string()
    .min(8, "Password should be atleast 8 characters")
    .max(30, "Password should not exceed 30 characters"),
    confirmPassword: z.string().refine(data => data.length > 0, "Confirm password is required")
}).refine(data => data.confirmPassword === data.password, {
    message: "Password didn't match",
    path: ["confirmPassword"]
})
