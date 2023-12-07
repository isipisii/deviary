import z from "zod"
import {  githubLinkRegex, facebookLinkRegex, linkedinLinkRegex } from "../constants"

export const signInSchema = z.object({
    email: z.string()
    .min(1, { message: "Email is required" })
    .email(),
    password: z.string()
    .min(8, "Password must be atleast 8 characters")
    .max(30, "Password should not exceed to 30 characters")
})

export const signUpSchema = z.object({
    email: z.string()
    .min(1, { message: "Email is required" })
    .email(),
    password: z.string()
    .min(8, "Password should be atleast 8 characters")
    .max(30, "Password should not exceed 30 characters"),
    confirmPassword: z.string().refine(data => data.length > 0, "Confirm password is required")
}).refine(data => data.confirmPassword === data.password, {
    message: "Password didn't match",
    path: ["confirmPassword"]
})


export const onboardingSchema = z.object({
    name: z.string()
    .min(1, {message: "Name is required"})
    .max(50, {message: "Name should not exceed to 50 characters."}),
    githubLink: z.string().refine(data => githubLinkRegex.test(data), { message: "Please put valid github link" }).nullable(),
    facebookLink: z.string().refine(data => facebookLinkRegex.test(data), { message: "Please put valid facebook link" }).nullable(),
    // linkedinLink: z.string().refine(data => linkedinLinkRegex.test(data), { message: "Please put valid linkedin link" }).nullish()
})