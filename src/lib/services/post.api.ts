import { TBlogSchema } from "@/app/(protected)/post/components/blog-post-form";
import axios from "axios";

export async function createBlogPost(formData: FormData) {
    const response = await axios.post("/api/blog", formData)
    return response.data.data as TBlogPost
}