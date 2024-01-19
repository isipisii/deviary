import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
  QueryClient,
} from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { updateRoute } from "../actions";
import { QueryKeys } from "../constants";

export function useUpvote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      await axios.post("/api/upvote", { params: { postId } });
    },
    onMutate: () => {
    //    TODO: perform an optimistic update here
      const previousPosts = queryClient.getQueryData([QueryKeys.Posts]);
      const previousBookmarks = queryClient.getQueryData([QueryKeys.Bookmarks]);

      return { previousPosts, previousBookmarks };
    },
    onSuccess: () => {
    //    TODO: perform an optimistic update here
    },
    onError: (error: AxiosResponse<ErrorResponse>, postId, context) => {
        queryClient.setQueryData([QueryKeys.Posts], context?.previousPosts)
        queryClient.setQueryData([QueryKeys.Bookmarks], context?.previousBookmarks)
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
