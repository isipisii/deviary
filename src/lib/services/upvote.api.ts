import {
  useMutation,
  useQueryClient,
  InfiniteData,
  QueryClient,
} from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { updateRoute } from "../actions";
import { QueryKeys } from "../constants";

export function useUpvote() {
  const queryClient = useQueryClient();
  const controller = new AbortController();

  return useMutation({  
    mutationKey: ["upvote"],
    mutationFn: async (postId: string) => {
      return await axios.post("/api/upvote", {}, { params: { postId }, signal: controller.signal });
    },
    onMutate: (postId) => {
      const previousPosts = queryClient.getQueryData([QueryKeys.Posts]);
      const previousBookmarks = queryClient.getQueryData([QueryKeys.Bookmarks]);

      upvoteOptismiticUpdate(queryClient, postId, true)

      return { previousPosts, previousBookmarks };
    },
    onError: (error: AxiosResponse<ErrorResponse>, postId, context) => {
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
    },
  });
}

export function useRemoveUpvote() {
  const queryClient = useQueryClient();
  const controller = new AbortController();

  return useMutation({
    mutationKey: ["removeUpvote"],
    mutationFn: async (postId: string) => {
      return await axios.delete("/api/upvote", { params: { postId }, signal: controller.signal });
    },
    onMutate: (postId) => {
      const previousPosts = queryClient.getQueryData([QueryKeys.Posts]);
      const previousBookmarks = queryClient.getQueryData([QueryKeys.Bookmarks]);

      upvoteOptismiticUpdate(queryClient, postId, false)

      return { previousPosts, previousBookmarks };
    },
    onError: (error: AxiosResponse<ErrorResponse>, postId, context) => {
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
    },
  });
}

function upvoteOptismiticUpdate(queryClient: QueryClient, postId: string, upvoted: boolean) {
  return queryClient.setQueryData<InfiniteData<TPage<TPost[]>>>(
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
}
