import axios, { AxiosError } from "axios";
import { TDiarySchema } from "../validators/post-validator";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next-nprogress-bar";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";

// export async function createBlogPost(blogPostData: FormData) {
//     const response = await axios.post("/api/blog", blogPostData)
//     return response.data.data as TBlogPost
// }

export function useCreateBlogPost(clearForm: () => void) {
    const router = useRouter()
    return useMutation({
        mutationFn: async (blogPostData: FormData) => {
            const response = await axios.post("/api/blog", blogPostData)
            return response.data.data as TBlogPost
        },
        onSuccess: (data) => {
            toast.success("Blog posted sucessfully")
            clearForm()
            router.push("/feed")
        },
        onError: (error: AxiosError<ErrorResponse>) =>  {
            toast.error(error.response?.data?.message)
        },
    })
}

export function useCreateDiary(formReturn: UseFormReturn) {
    const router = useRouter()
    return useMutation({
        mutationFn: async (diaryData: TDiarySchema & { tags: string }) => {
            const response = await axios.post("/api/diary", diaryData)
            return response.data.data 
        },
        onSuccess: (data) => {
            toast.success("Diary posted sucessfully")
            formReturn.reset()
            router.push("/feed")
        },
        onError: (error: AxiosError<ErrorResponse>) =>  {
            toast.error(error.response?.data?.message)
        },
    })
}