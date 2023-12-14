import z from "zod"
import {  githubLinkRegex, facebookLinkRegex, linkedinLinkRegex } from "../constants"
import { validEmailRegex } from "../constants"

export const signInSchema = z.object({
    email: z.string()
    .min(1, { message: "Email is required" })
    .email().refine(data => validEmailRegex.test(data), { message: "Please put valid email" }),
    password: z.string()
    .min(8, "Password must be atleast 8 characters")
    .max(30, "Password should not exceed to 30 characters")
})

export const signUpSchema = z.object({
    email: z.string()
    .min(1, { message: "Email is required" })
    .email().refine(data => validEmailRegex.test(data), { message: "Please put valid email" }),
    password: z.string()
    .min(8, "Password should be atleast 8 characters")
    .max(30, "Password should not exceed 30 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required")
}).refine(data => data.confirmPassword === data.password, {
    message: "Password didn't match",
    path: ["confirmPassword"]
})


export const onboardingSchema = z.object({
    name: z.string()
    .min(1, {message: "Name is required"})
    .max(50, {message: "Name should not exceed to 50 characters."}),
    githubLink: z.string().refine(data => data ? githubLinkRegex.test(data) : true, { message: "Please put valid github link" }).nullable(),
    facebookLink: z.string().refine(data => data ?  facebookLinkRegex.test(data) : true, { message: "Please put valid facebook link" }).nullable(),
})