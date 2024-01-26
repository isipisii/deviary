import {
  useMutation,
  useQueryClient,
  InfiniteData,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { updateRoute } from "../actions";
import { QueryKeys } from "../constants";
import { usePathname, useSearchParams } from "next/navigation";

export function useUpvote() {
  const queryClient = useQueryClient();
  const controller = new AbortController();
  const path = usePathname();
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get("query") as string

  return useMutation({
    mutationKey: ["upvote"],
    mutationFn: async (postId: string) => {
      return await axios.post(
        "/api/upvote",
        {},
        { params: { postId }, signal: controller.signal },
      );
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: [QueryKeys.Posts] });
      await queryClient.cancelQueries({ queryKey: [QueryKeys.Bookmarks] });

      const previousPosts = queryClient.getQueryData([QueryKeys.Posts]);
      const previousBookmarks = queryClient.getQueryData([QueryKeys.Bookmarks]);

      upvoteOptismiticUpdate(queryClient, postId, true, searchQuery);

      return { previousPosts, previousBookmarks };
    },
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
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.SearchedPosts, searchQuery],
      });
      updateRoute(path as string);
    },
  });
}

export function useRemoveUpvote() {
  const queryClient = useQueryClient();
  const controller = new AbortController();
  const path = usePathname();
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get("query") as string

  return useMutation({
    mutationKey: ["removeUpvote"],
    mutationFn: async (postId: string) => {
      return await axios.delete("/api/upvote", {
        params: { postId },
        signal: controller.signal,
      });
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: [QueryKeys.Posts] });
      await queryClient.cancelQueries({ queryKey: [QueryKeys.Bookmarks] });

      const previousPosts = queryClient.getQueryData([QueryKeys.Posts]);
      const previousBookmarks = queryClient.getQueryData([QueryKeys.Bookmarks]);

      upvoteOptismiticUpdate(queryClient, postId, false, searchQuery);

      return { previousPosts, previousBookmarks };
    },
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

      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.SearchedPosts, searchQuery],
      });
      updateRoute(path as string);
    },
  });
}

function upvoteOptismiticUpdate(
  queryClient: QueryClient,
  postId: string,
  upvoted: boolean,
  searchQuery?: string
) {
  const cachedBookmarks = queryClient.getQueryData([QueryKeys.Bookmarks]);
  const cachedSearchedPosts = queryClient.getQueryData([QueryKeys.SearchedPosts, searchQuery]);

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
                  data: page.data
                    ? page.data.map((post) =>
                        post.id === postId
                          ? {
                              ...post,
                              upvoteCount: upvoted
                                ? post.upvoteCount + 1
                                : post.upvoteCount - 1,
                              isUpvoted: upvoted,
                            }
                          : post,
                      )
                    : [],
                };
              }

              return page;
            }),
          }
        : oldData;

      return newData;
    },
  );

  //optimistic update for bookmarks
  if (cachedBookmarks) {
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
                    data: page.data
                      ? page.data.map((bookmark) =>
                          bookmark.post.id === postId
                            ? {
                                ...bookmark,
                                post: {
                                  ...bookmark.post,
                                  upvoteCount: upvoted
                                    ? bookmark.post.upvoteCount + 1
                                    : bookmark.post.upvoteCount - 1,
                                  isUpvoted: upvoted,
                                },
                              }
                            : bookmark,
                        )
                      : [],
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

  if(cachedSearchedPosts && searchQuery) {
    queryClient.setQueryData<TPost[]>([QueryKeys.SearchedPosts, searchQuery], (oldData) => {
      const newData = oldData
        ? oldData.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isUpvoted: upvoted,
                  upvoteCount: upvoted
                    ? post.upvoteCount + 1
                    : post.upvoteCount - 1,
                }
              : post,
          )
        : oldData;
  
      return newData;
    });
  }
}
