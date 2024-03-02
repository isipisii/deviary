import axios, { AxiosError } from "axios";
import { TDiarySchema } from "../validators/post.validator";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { QueryClient } from "@tanstack/query-core";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { QueryKeys } from "../constants";
import { updateRoute } from "../actions";
import formatPostHref from "@/utils/formatPostHref";

export async function getFeedPosts(take: number, lastCursor: string) {
  const response = await axios.get("/api/post", {
    //the filter will only attach to the params if its truthy value
    params: { take, lastCursor },
  });
  return response.data.data as TPage<TPost[]>;
}

export async function getPopularPosts(take: number, lastCursor: string) {
  const response = await axios.get("/api/post/popular", {
    params: { take, lastCursor },
  });
  return response.data.data as TPage<TPost[]>;
}

export function useGetPopularPosts() {
  return useInfiniteQuery({
    queryKey: [QueryKeys.PopularPosts],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getPopularPosts(5, lastCursor),
    getNextPageParam: (lastPage) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
  });
}

export function useGetFeedPosts() {
  return useInfiniteQuery({
    queryKey: [QueryKeys.Posts],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getFeedPosts(5, lastCursor),
    getNextPageParam: (lastPage) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
  });
}

export function useCreateBlogPost(clearForm: () => void) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (blogPostData: FormData) => {
      const response = await axios.post("/api/blog", blogPostData);
      return response.data.data as TPost;
    },
    onSuccess: (data) => {
      //for optimistic update of the ui
      createPostOptimisticUpdate(queryClient, data);
      toast.success("Blog posted sucessfully");
      clearForm();
      router.push("/feed");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message);
    },
  });
}

export function useUpdateBlogPost() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      blogPostData,
      postId,
    }: {
      blogPostData: FormData;
      postId: string;
    }) => {
      const response = await axios.patch(`/api/blog/${postId}`, blogPostData);
      return response.data.data as TPost;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Bookmarks] });
      //for optimistic update of the ui
      updatePostOptimisticUpdate(queryClient, data);
      router.push("/feed");
      toast.success("Blog post updated sucessfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message);
    },
  });
}

export function useCreateDiary(formReturn: UseFormReturn) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (diaryData: TDiarySchema & { tags: string }) => {
      const response = await axios.post("/api/diary", diaryData);
      return response.data.data as TPost;
    },
    onSuccess: (data) => {
      //for optimistic update of the ui
      createPostOptimisticUpdate(queryClient, data);
      formReturn.reset();
      router.push("/feed");
      toast.success("Diary posted sucessfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message);
    },
  });
}

export function useUpdateDiary() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      diaryData,
      postId,
    }: {
      diaryData: TDiarySchema & { tags: string };
      postId: string;
    }) => {
      const response = await axios.patch(`/api/diary/${postId}`, diaryData);
      return response.data.data as TPost;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Bookmarks] });
      updatePostOptimisticUpdate(queryClient, data);
      toast.success("Diary updated sucessfully");
      router.push("/feed");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message);
    },
  });
}

export function useDeletePost(closeModal?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.delete(`/api/post/${postId}`);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Posts],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Bookmarks],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.PopularPosts],
      });
      toast.success("Post deleted successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message);
    },
    onSettled: () => {
      if (closeModal) closeModal();
    },
  });
}

function createPostOptimisticUpdate(queryClient: QueryClient, newPost: TPost) {
  return queryClient.setQueryData<InfiniteData<TPage<TPost[]>>>(
    [QueryKeys.Posts],
    (oldData) => {
      const newData = oldData
        ? {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  data: [newPost, ...(page.data ? page.data : new Array())],
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

function updatePostOptimisticUpdate(
  queryClient: QueryClient,
  updatedPost: TPost,
) {
  //to keep the data updated in specific post in edit page
  updateRoute(`/post/edit/${updatedPost.id}`);
  updateRoute(formatPostHref(updatedPost));

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
                  data: page.data
                    ? page.data.map((post) =>
                        post.id === updatedPost.id ? updatedPost : post,
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
