import {
  useMutation,
  useQueryClient,
  InfiniteData,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { updateRoute } from "../actions";
import { QueryKeys } from "../constants";
import { useParams, usePathname, useSearchParams } from "next/navigation";

export function useUpvote() {
  const queryClient = useQueryClient();
  const controller = new AbortController();
  const params = useParams()
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get("query") as string
  const { tagName } = useParams() as { tagName: string }

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
      await cancelQueries(queryClient, searchQuery, tagName)
      const cachedDataSnapshot  = getCachedDataSnapshot(queryClient, searchQuery, tagName, params.guildId as string)
      upvoteOptismiticUpdate(queryClient, postId, true, searchQuery, tagName, params.guildId as string);

      return cachedDataSnapshot
    },
    onError: (error, postId, context) => {
      queryClient.setQueryData([QueryKeys.Posts], context?.previousPosts);
      queryClient.setQueryData(
        [QueryKeys.Bookmarks],
        context?.previousBookmarks,
      );
      queryClient.setQueryData([QueryKeys.PostsByTag, tagName], context?.previousPostsByTag);
      queryClient.setQueryData([QueryKeys.GuildSharedPosts, params.guildId ], context?.previousSharedPosts);
    },
    onSettled: async () => {
      await invalidateQueries(queryClient, searchQuery, tagName, params.guildId as string)
      // updateRoute(path as string);
    },
  });
}

export function useRemoveUpvote() {
  const queryClient = useQueryClient();
  const controller = new AbortController();
  const params = useParams()
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get("query") as string
  const { tagName } = useParams() as { tagName: string }

  return useMutation({
    mutationKey: ["removeUpvote"],
    mutationFn: async (postId: string) => {
      return await axios.delete("/api/upvote", {
        params: { postId },
        signal: controller.signal,
      });
    },
    onMutate: async (postId) => {
      await cancelQueries(queryClient, searchQuery, tagName)
      const cachedDataSnapshot  = getCachedDataSnapshot(queryClient, searchQuery, tagName)
      upvoteOptismiticUpdate(queryClient, postId, false, searchQuery, tagName, params.guildId as string);

      return cachedDataSnapshot
    },
    onError: (error, postId, context) => {
      queryClient.setQueryData([QueryKeys.Posts], context?.previousPosts);
      queryClient.setQueryData(
        [QueryKeys.Bookmarks],
        context?.previousBookmarks,
      );
      queryClient.setQueryData([QueryKeys.PostsByTag, tagName], context?.previousPostsByTag);
      queryClient.setQueryData([QueryKeys.GuildSharedPosts, params.guildId ], context?.previousSharedPosts);
    },
    onSettled: async () => {
      await invalidateQueries(queryClient, searchQuery, tagName, params.guildId as string)
      // updateRoute(path as string);
    },
  });
}

function getCachedDataSnapshot(queryClient: QueryClient, searchQuery?: string, tagName?: string, guildId?: string) {
  const previousPosts = queryClient.getQueryData([QueryKeys.Posts]);
  const previousBookmarks = queryClient.getQueryData([QueryKeys.Bookmarks]);
  const previousPostsByTag = queryClient.getQueryData([QueryKeys.PostsByTag, tagName]);
  const previousSearchedPosts = queryClient.getQueryData([QueryKeys.SearchedPosts, searchQuery]);
  const previousPopularPosts = queryClient.getQueryData([QueryKeys.PopularPosts]);
  const previousSharedPosts = queryClient.getQueryData([QueryKeys.GuildSharedPosts, guildId])

  return { previousBookmarks, previousPostsByTag, previousPosts, previousSearchedPosts, previousPopularPosts , previousSharedPosts }
}

async function cancelQueries(queryClient: QueryClient, searchQuery?: string, tagName?: string, guildId?: string) {
  await queryClient.cancelQueries({ queryKey: [QueryKeys.Posts] });
  await queryClient.cancelQueries({ queryKey: [QueryKeys.Bookmarks] });
  await queryClient.cancelQueries({ queryKey: [QueryKeys.SearchedPosts, searchQuery] });
  await queryClient.cancelQueries({ queryKey: [QueryKeys.PostsByTag, tagName] });
  await queryClient.cancelQueries({ queryKey: [QueryKeys.PopularPosts] });
  await queryClient.cancelQueries({ queryKey: [QueryKeys.GuildSharedPosts, guildId] });
}

async function invalidateQueries(queryClient: QueryClient, searchQuery?: string, tagName?: string, guildId?: string) {
  await queryClient.invalidateQueries({
    queryKey: [QueryKeys.Posts],
  });
  await queryClient.invalidateQueries({
    queryKey: [QueryKeys.Bookmarks],
  });
  await queryClient.invalidateQueries({
    queryKey: [QueryKeys.SearchedPosts, searchQuery],
  });
  await queryClient.invalidateQueries({ queryKey: [QueryKeys.PostsByTag, tagName] });
  await queryClient.invalidateQueries({ queryKey: [QueryKeys.PopularPosts] });
  await queryClient.invalidateQueries({ queryKey: [QueryKeys.GuildSharedPosts, guildId] });
}

function upvoteOptismiticUpdate(
  queryClient: QueryClient,
  postId: string,
  upvoted: boolean,
  searchQuery?: string,
  tagPageParam?: string,
  guildId?: string
) {
  const cachedBookmarks = queryClient.getQueryData([QueryKeys.Bookmarks]);
  const cachedSearchedPosts = queryClient.getQueryData([QueryKeys.SearchedPosts, searchQuery]);
  const cachedSharedPosts = queryClient.getQueryData([QueryKeys.GuildSharedPosts, guildId])
  const cachedReadingHistories = queryClient.getQueryData([QueryKeys.ReadingHistories])

  // posts in feed page
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

  // posts that has been shared in guild's page
  if (cachedSharedPosts) {
    queryClient.setQueryData<InfiniteData<TPage<TGuildSharedPost[]>>>(
      [QueryKeys.GuildSharedPosts, guildId],
      (oldData) => {
        const newData = oldData
          ? {
              ...oldData,
              pages: oldData.pages.map((page) => {
                if (page) {
                  return {
                    ...page,
                    data: page.data
                      ? page.data.map((sharedPost) =>
                          sharedPost.post.id === postId
                            ? {
                                ...sharedPost,
                                post: {
                                  ...sharedPost.post,
                                  upvoteCount: upvoted
                                    ? sharedPost.post.upvoteCount + 1
                                    : sharedPost.post.upvoteCount - 1,
                                  isUpvoted: upvoted,
                                },
                              }
                            : sharedPost,
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

  // posts in bookmarks page
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
                      ? page.data.map((sharedPost) =>
                          sharedPost.post.id === postId
                            ? {
                                ...sharedPost,
                                post: {
                                  ...sharedPost.post,
                                  upvoteCount: upvoted
                                    ? sharedPost.post.upvoteCount + 1
                                    : sharedPost.post.upvoteCount - 1,
                                  isUpvoted: upvoted,
                                },
                              }
                            : sharedPost,
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

   // posts in history
   if (cachedReadingHistories) {
    queryClient.setQueryData<InfiniteData<TPage<TReadingHistory[]>>>(
      [QueryKeys.ReadingHistories],
      (oldData) => {
        const newData = oldData
          ? {
              ...oldData,
              pages: oldData.pages.map((page) => {
                if (page) {
                  return {
                    ...page,
                    data: page.data
                      ? page.data.map((readingHistory) =>
                          readingHistory.post.id === postId
                            ? {
                                ...readingHistory,
                                post: {
                                  ...readingHistory.post,
                                  upvoteCount: upvoted
                                    ? readingHistory.post.upvoteCount + 1
                                    : readingHistory.post.upvoteCount - 1,
                                  isUpvoted: upvoted,
                                },
                              }
                            : readingHistory,
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

  // posts in search post page
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

  // posts in tag page
  queryClient.setQueryData<InfiniteData<TPage<TPost[]>>>(
    [QueryKeys.PostsByTag, tagPageParam],
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

  // posts in popular page
  queryClient.setQueryData<InfiniteData<TPage<TPost[]>>>(
    [QueryKeys.PopularPosts],
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
}
