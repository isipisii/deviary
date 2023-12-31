import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { QueryKeys } from "../constants";
import { Session } from "next-auth";

export async function getBookmarks(take: number, lastCursor: string) {
    const response = await axios.get("/api/bookmark", {
        params: { take, lastCursor }
    })
    return response.data.data as TPage<TBookmark[]>
}

export function useGetBookmarks() {
    return useInfiniteQuery({
        queryKey: [QueryKeys.Bookmarks],
        initialPageParam: "",
        queryFn: ({ pageParam: lastCursor }) => getBookmarks(5, lastCursor),
        getNextPageParam: (lastPage) =>
          lastPage.metaData ? lastPage?.metaData.lastCursor : null, 
    });
}

export type TBookmarks = { id: string, postId: string }[]
type TUpdateSessionAndToken = (data?: any) => Promise<Session | null>

export function useCreateBookmark(bookmarks: TBookmarks, updateSessionAndToken: TUpdateSessionAndToken) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (postId: string) => {
            const response = await axios.post(`/api/bookmark/create/${postId}`)
            return response.data.data as TBookmark
        },
        onSuccess: async (data) => {
            await updateSessionAndToken({ bookmarks: [...bookmarks, { id: data.id, postId: data.postId }]})
            await queryClient.invalidateQueries({queryKey: [QueryKeys.Bookmarks]})
            toast.success("Added to bookmarks")
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message)
        },
        // onSettled: () => {
        //     console.log(data?.user)
        // }
    })
}

export function useRemoveBookmark(bookmarks: TBookmarks, updateSessionAndToken: TUpdateSessionAndToken) {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: async (bookmarkId: string) => {
            const response = await axios.delete(`/api/bookmark/delete/${bookmarkId}`)
            return response.data.data  
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: [QueryKeys.Bookmarks]})
        },
        onMutate: async (bookmarkId) => {
            const updatedBookmarks = bookmarks.filter(bookmark => bookmark?.id !== bookmarkId)
            await updateSessionAndToken({ bookmarks: updatedBookmarks })
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message)
        }
    })
}