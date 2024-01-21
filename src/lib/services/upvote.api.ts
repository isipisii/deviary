import {
  useMutation,
  useQueryClient,
  InfiniteData,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { updateRoute } from "../actions";
import { QueryKeys } from "../constants";
import { usePathname } from "next/navigation";

export function useUpvote() {
  const queryClient = useQueryClient();
  const controller = new AbortController();
  const path = usePathname()

  return useMutation({  
    mutationKey: ["upvote"],
    mutationFn: async (postId: string) => {
      return await axios.post("/api/upvote", {}, { params: { postId }, signal: controller.signal });
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: [QueryKeys.Posts] })
      await queryClient.cancelQueries({ queryKey: [QueryKeys.Bookmarks] })

      const previousPosts = queryClient.getQueryData([QueryKeys.Posts]);
      const previousBookmarks = queryClient.getQueryData([QueryKeys.Bookmarks]);

      upvoteOptismiticUpdate(queryClient, postId, true)

      return { previousPosts, previousBookmarks };
    },
    // onSuccess: (data, postId) => {
    //   upvoteOptismiticUpdate(queryClient, postId, true)
    // },
    onError: (error, postId, context) => {
      queryClient.setQueryData([QueryKeys.Posts], context?.previousPosts);
      queryClient.setQueryData(
        [QueryKeys.Bookmarks],
        context?.previousBookmarks,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Posts],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Bookmarks],
      });
      updateRoute(path)
    },
  });
}

export function useRemoveUpvote() {
  const queryClient = useQueryClient();
  const controller = new AbortController();
  const path = usePathname()

  return useMutation({
    mutationKey: ["removeUpvote"],
    mutationFn: async (postId: string) => {
      return await axios.delete("/api/upvote", { params: { postId }, signal: controller.signal });
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: [QueryKeys.Posts] })
      await queryClient.cancelQueries({ queryKey: [QueryKeys.Bookmarks] })

      const previousPosts = queryClient.getQueryData([QueryKeys.Posts]);
      const previousBookmarks = queryClient.getQueryData([QueryKeys.Bookmarks]);

      upvoteOptismiticUpdate(queryClient, postId, false)

      return { previousPosts, previousBookmarks };
    },
    // onSuccess: (data, postId) => {
    //    upvoteOptismiticUpdate(queryClient, postId, false)
    // },
    onError: (error, postId, context) => {
      queryClient.setQueryData([QueryKeys.Posts], context?.previousPosts);
      queryClient.setQueryData(
        [QueryKeys.Bookmarks],
        context?.previousBookmarks,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Posts],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Bookmarks],
      });
      updateRoute(path)
    },
  });
}

function upvoteOptismiticUpdate(queryClient: QueryClient, postId: string, upvoted: boolean) {
  const cachedBookmarks = queryClient.getQueryData([QueryKeys.Bookmarks]);

  //optimistic update for post
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
                  data: page.data ? page.data.map((post) =>
                    post.id === postId
                      ? 
                        {
                          ...post,
                          upvoteCount: upvoted ? post.upvoteCount + 1 : post.upvoteCount - 1,
                          isUpvoted: upvoted,
                        }     
                      : post,
                  ) : []
                };
              }

              return page;
            }),
          }
        : oldData;

      return newData;
    },
  );
  
  //optimistic update for bookmark
  if(cachedBookmarks) {
    queryClient.setQueryData<InfiniteData<TPage<TBookmark[]>>>(
      [QueryKeys.Bookmarks],
      (oldData) => {
        const newData = oldData
          ? {
              ...oldData,
              pages: oldData.pages.map((page) => {
                if (page) {
                  return {
                    ...page,
                    data: page.data ? page.data.map((bookmark) =>
                      bookmark.post.id === postId
                        ? 
                          {
                            ...bookmark,
                            post: {
                              ...bookmark.post,
                              upvoteCount: upvoted ? bookmark.post.upvoteCount + 1 : bookmark.post.upvoteCount - 1,
                              isUpvoted: upvoted, 
                            }
                          }     
                        : bookmark,
                    ) : []
                  };
                }
  
                return page;
              }),
            }
          : oldData;
  
        return newData;
      },
    )
  }
}
