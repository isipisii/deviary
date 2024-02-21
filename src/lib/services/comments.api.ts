import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { QueryKeys } from "../constants";

export async function getPostComments(
  take: number,
  lastCursor: string,
  postId: string,
) {
  const res = await axios.get("/api/comments", {
    params: { take, lastCursor, postId },
  });

  return res.data.data as TPage<TComment[]>;
}

export function useGetPostComments(postId: string) {
  return useInfiniteQuery({
    queryKey: [QueryKeys.Comments, postId],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) =>
      getPostComments(5, lastCursor, postId),
    getNextPageParam: (lastPage) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
  });
}

export function useCreateComment(resetForm: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createComment"],
    mutationFn: async ({
      content,
      postId,
    }: {
      content: string;
      postId: string;
    }) => {
      const res = await axios.post(
        "/api/comments",
        { content },
        { params: { postId } },
      );
      return res.data.newComment as TComment;
    },
    onSuccess: (newComment, { postId }) => {
      queryClient.setQueryData<InfiniteData<TPage<TComment[]>>>(
        [QueryKeys.Comments, postId],
        (oldData) => {
          const newData = oldData
            ? {
                ...oldData,
                pages: oldData.pages.map((page, index) => {
                  if (index === 0) {
                    return {
                      ...page,
                      data: [
                        newComment,
                        ...(page.data ? page.data : new Array()),
                      ],
                    };
                  }
                  return page;
                }),
              }
            : oldData;

          return newData;
        },
      );
      resetForm();
    },
    onError: (error) => {
      toast.error("An error occured while creating a comment");
      console.log(error);
    },
  });
}

export function useEditComment(closeEditForm?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["editComment"],
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
      postId: string;
    }) => {
      const res = await axios.patch(`/api/comments/${commentId}`, {
        content,
      });

      return res.data.updatedComment as TComment;
    },
    onSuccess: async (updatedComment, { postId }) => {
      queryClient.setQueryData<InfiniteData<TPage<TComment[]>>>(
        [QueryKeys.Comments, postId],
        (oldData) => {
          const newData = oldData
            ? {
                ...oldData,
                pages: oldData.pages.map((page, index) => {
                  if (page) {
                    return {
                      ...page,
                      data: page.data
                        ? page.data.map((comment) =>
                            comment.id === updatedComment.id
                              ? updatedComment
                              : comment,
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

      if (closeEditForm) closeEditForm();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error("An error occured while deleting a comment");
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteComment"],
    mutationFn: async (commentId: string) => {
      return await axios.delete(`/api/comments/${commentId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Comments] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error("An error occured while deleting a comment");
    },
  });
}

export function useCreateReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createReply"],
    mutationFn: async ({
      content,
      postId,
      commentId,
    }: {
      content: string;
      postId: string;
      commentId: string;
    }) => {
      return await axios.post(
        `/api/comments/reply/${commentId}`,
        { content },
        { params: { commentId, postId } },
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Comments] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error("An error occured while creating a comment");
    },
  });
}
