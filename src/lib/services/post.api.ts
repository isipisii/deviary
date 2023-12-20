import axios, { AxiosError } from "axios";
import { TDiarySchema } from "../validators/post-validator";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next-nprogress-bar";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";


export async function getFeedPosts(take: number, lastCursor: string) {
    const response = await axios.get("/api/post", {
        params: { take, lastCursor }
    })  
    return response.data.data as TFeedPostsPage
}

export function useFeedPosts() {
    return useInfiniteQuery({
      queryKey: ["posts"],
      initialPageParam: "",
      queryFn: ({ pageParam: lastCursor }) => getFeedPosts(5, lastCursor),
      getNextPageParam: (lastPage) => lastPage.metaData ? lastPage?.metaData.lastCursor : null,
  });
}

export function useCreateBlogPost(clearForm: () => void) {
    const queryClient = useQueryClient()
    const router = useRouter()
    return useMutation({
        mutationFn: async (blogPostData: FormData) => {
            const response = await axios.post("/api/blog", blogPostData)
            return response.data.data as TBlog
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
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
        onSuccess: () => {
            toast.success("Diary posted sucessfully")
            formReturn.reset()
            router.push("/feed")
        },
        onError: (error: AxiosError<ErrorResponse>) =>  {
            toast.error(error.response?.data?.message)
        },
    })
}