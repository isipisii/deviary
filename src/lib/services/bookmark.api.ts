import { useMutation, useInfiniteQuery, useQueryClient, InfiniteData } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { QueryKeys } from "../constants";

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

export function useCreateBookmark() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (postId: string) => {
            const response = await axios.post(`/api/bookmark/create/${postId}`)
            return response.data.data as TBookmark
        },
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: [QueryKeys.Bookmarks] })
            await queryClient.cancelQueries({ queryKey: [QueryKeys.Posts] })
            const previousPosts =  queryClient.getQueryData([QueryKeys.Posts]) 

            queryClient.setQueryData<InfiniteData<TPage<TPost[]>>>(
                [QueryKeys.Posts],
                (oldData) => {
                  const newData = oldData
                    ? {
                        ...oldData,
                        pages: oldData.pages.map((page) => {
                          if (page) {
                            return {
                              ...page,
                              data: page.data ? page.data.map(data => data.id === postId ? {...data, isBookmarked: true}: data) : []
                            };
                          }
                          return page;
                        }),
                      }
                    : oldData;
    
                  return newData;
                }
            );
            toast.success("Added to bookmarks")
            return { previousPosts }
        },
        onSuccess: async () => {
            return await queryClient.invalidateQueries({queryKey: [QueryKeys.Bookmarks]})
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error("An error occured while adding to bookmark")
        },
        onSettled: async () => {
           await queryClient.invalidateQueries({ queryKey: [QueryKeys.Posts, QueryKeys.Bookmarks] })
        },
    })
}

export function useRemoveBookmark() {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: async ({ bookmarkId, postId }: { bookmarkId: string, postId: string }) => {
            const response = await axios.delete(`/api/bookmark/delete/${bookmarkId}`)
            return response.data.data  
        },
        onMutate: async ({ postId }) => {
            await queryClient.cancelQueries({ queryKey: [QueryKeys.Bookmarks] })
            await queryClient.cancelQueries({ queryKey: [QueryKeys.Posts] })
            const previousPosts =  queryClient.getQueryData<InfiniteData<TPage<TPost[]>>>([QueryKeys.Posts]) 
            const previousBookmarks =  queryClient.getQueryData<InfiniteData<TPage<TBookmark[]>>>([QueryKeys.Bookmarks]) 

            queryClient.setQueryData<InfiniteData<TPage<TPost[]>>>(
                [QueryKeys.Posts],
                (oldData) => {
                  const newData = oldData
                    ? {
                        ...oldData,
                        pages: oldData.pages.map((page) => {
                          if (page) {
                            return {
                              ...page,
                              data: page.data ? page.data.map(data => data.id === postId ? {...data, isBookmarked: false}: data) : []
                            };
                          }
                          return page;
                        }),
                      }
                    : oldData;
                  return newData;
                }
            );
            toast.success("Removed from bookmarks")
            return { previousPosts, previousBookmarks }
        },
        onSuccess: async () => {
            return await queryClient.invalidateQueries({queryKey: [QueryKeys.Bookmarks]})
        },
        onError: (error, bookmark, context) => {
            // queryClient.setQueryData(
            //     [QueryKeys.Posts],
            //     context?.previousPosts
            // )
            // queryClient.setQueryData(
            //     [QueryKeys.Bookmarks],
            //     context?.previousBookmarks
            // )
            toast.error("An error occured while removing from bookmark")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [QueryKeys.Posts, QueryKeys.Bookmarks] })
        },
    })
}
