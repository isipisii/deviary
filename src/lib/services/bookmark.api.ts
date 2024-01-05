import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
  QueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { QueryKeys } from "../constants";

export async function getBookmarks(take: number, lastCursor: string) {
  const response = await axios.get("/api/bookmark", {
    params: { take, lastCursor },
  });
  return response.data.data as TPage<TBookmark[]>;
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
  const queryClient = useQueryClient();
  const controller = new AbortController();

  return useMutation({
    mutationKey: ["addBookmark"],
    mutationFn: async (postId: string) => {
      const response = await axios.post(`/api/bookmark/create/${postId}`, {
        signal: controller.signal,
      });
      return response.data.data as TBookmark;
    },
    onMutate: (postId) => {
      optimisticUpdatePostBookmarkStatus(queryClient, true, postId, "");

      // await queryClient.cancelQueries({
      //   queryKey: [QueryKeys.Bookmarks],
      // });
      // await queryClient.cancelQueries({ queryKey: [QueryKeys.Posts] });

      const previousPosts = queryClient.getQueryData([QueryKeys.Posts]);
      const previousBookmarks = queryClient.getQueryData([QueryKeys.Bookmarks]);

      toast.success("Added to bookmarks");
      return { previousPosts, previousBookmarks };
    },
    onSuccess: async (data, postId) => {
      optimisticUpdatePostBookmarkStatus(queryClient, true, postId, data.id);
      addBookmarkOptimisticUpdate(queryClient, data);
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
    },
  });
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();
  const controller = new AbortController();

  return useMutation({
    mutationKey: ["removeBookmark"],
    mutationFn: async ({
      bookmarkId,
      postId,
    }: {
      bookmarkId: string;
      postId: string;
    }) => {
      const response = await axios.delete(
        `/api/bookmark/delete/${bookmarkId}`,
        { signal: controller.signal },
      );
      return response.data.data;
    },
    onMutate: ({ postId, bookmarkId }) => {
      optimisticUpdatePostBookmarkStatus(queryClient, false, postId);

      // await queryClient.cancelQueries({
      //   queryKey: [QueryKeys.Bookmarks, bookmarkId],
      // });
      // await queryClient.cancelQueries({ queryKey: [QueryKeys.Posts, postId] });

      const previousPosts = queryClient.getQueryData([QueryKeys.Posts]);
      const previousBookmarks = queryClient.getQueryData([QueryKeys.Bookmarks]);

      toast.success("Removed from bookmarks");
      return { previousPosts, previousBookmarks };
    },
    onSuccess: async (data, variables) => {
      optimisticUpdatePostBookmarkStatus(
        queryClient,
        true,
        variables.postId,
        undefined,
      );
    },
    onError: (error, bookmark, context) => {
      queryClient.setQueryData([QueryKeys.Posts], context?.previousPosts);
      queryClient.setQueryData(
        [QueryKeys.Bookmarks],
        context?.previousBookmarks,
      );
      // toast.error("An error occured while removing from bookmark");
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

function optimisticUpdatePostBookmarkStatus(
  queryClient: QueryClient,
  status: boolean,
  postId: string,
  bookmarkId?: string,
) {
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
                    ? page.data.map((data) =>
                        data.id === postId
                          ? {
                              ...data,
                              isBookmarked: status,
                              bookmarkId,
                            }
                          : data,
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

function addBookmarkOptimisticUpdate(
  queryClient: QueryClient,
  newBookmark: TBookmark,
) {
  return queryClient.setQueryData<InfiniteData<TPage<TBookmark[]>>>(
    [QueryKeys.Bookmarks],
    (oldData) => {
      const newData = oldData
        ? {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  data: [newBookmark, ...(page.data ? page.data : new Array())],
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
