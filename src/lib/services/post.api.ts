import axios, { AxiosError } from "axios";
import { TDiarySchema } from "../validators/post-validator";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next-nprogress-bar";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";

export async function getFeedPosts(take: number, lastCursor: string) {
  const response = await axios.get("/api/post", {
    params: { take, lastCursor },
  });
  return response.data.data as TFeedPostsPage;
}

export function useFeedPosts() {
  return useInfiniteQuery({
    queryKey: ["posts"],
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
      queryClient.setQueryData<InfiniteData<TFeedPostsPage>>(
        ["posts"],
        (oldData) => {
          const newData = oldData
            ? {
                ...oldData,
                pages: oldData.pages.map((page, index) => {
                  if (index === 0) {
                    return {
                      ...page,
                      posts: [data, ...(page.posts ? page.posts : new Array())],
                    };
                  }
                  return page;
                }),
              }
            : oldData;

          return newData;
        }
      );
      toast.success("Blog posted sucessfully");
      clearForm();
      router.push("/feed");
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
      return response.data.data;
    },
    onSuccess: (data: TPost) => {
      //for optimistic update of the ui
      queryClient.setQueryData<InfiniteData<TFeedPostsPage>>(
        ["posts"],
        (oldData) => {
          const newData = oldData
            ? {
                ...oldData,
                pages: oldData.pages.map((page, index) => {
                  if (index === 0) {
                    return {
                      ...page,
                      posts: [data, ...(page.posts ? page.posts : new Array())],
                    };
                  }
                  return page;
                }),
              }
            : oldData;

          return newData;
        }
      );

      // await queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Diary posted sucessfully");
      formReturn.reset();
      router.push("/feed");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message);
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.delete(`/api/post/${postId}`)
      return response.data
    },
    onSuccess: async (data) => {  
      // await queryClient.invalidateQueries({queryKey: ["posts"]})
      queryClient.setQueryData<InfiniteData<TFeedPostsPage>>(
        ["posts"],
        (oldData) => {
          console.log(oldData, "old")
          const newData = oldData
            ? {
                ...oldData,
                pages: oldData.pages.map((page) => {
                    //checks if the page has a value
                    if(page) {
                      return {
                        ...page,
                        posts: page.posts ? page.posts.filter((post) => post.id !== data.deletedPost.id) : []
                      };
                    }
                    return page
                }),
              }
            : oldData;
          console.log(newData, "new")
          return newData;
        }
      );
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message);
    }
  })
}