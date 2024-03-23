import z from "zod"
import {  githubLinkRegex, facebookLinkRegex } from "../constants"

export const updateProfileSchema = z.object({
    name: z.string()
    .min(1, {message: "Name is required"})
    .max(50, {message: "Name should not exceed to 50 characters."}),
    username: z.string()
    .min(1, {message: "Username is required"})
    .max(30, {message: "Username should not exceed to 30 characters."}),
    bio: z.string().max(300, { message: "Bio should not exceed to 300 characters."}).nullable(),
    githubLink: z.string().refine(data => data ? githubLinkRegex.test(data) : true, { message: "Please put valid github link" }).nullable(),
    facebookLink: z.string().refine(data => data ?  facebookLinkRegex.test(data) : true, { message: "Please put valid facebook link" }).nullable(),
})