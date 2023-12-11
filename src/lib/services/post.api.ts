import { TBlogSchema } from "@/app/(protected)/post/components/create-blog-post-form";
import axios from "axios";

export async function  createBlogPost(formData: FormData) {
    const response = await axios.post("/api/post", formData)
    return response.data.data as TBlogPost
}