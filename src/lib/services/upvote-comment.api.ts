import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import axios from "axios";
import { QueryKeys } from "../constants";
import { useParams } from "next/navigation";

export function useUpvoteComment() {
  const queryClient = useQueryClient();
  const controller = new AbortController();
  const { postTitle: title } = useParams<{ postTitle: string }>();
  const postId = title.split("-").at(-1);

  return useMutation({
    mutationKey: ["upvoteComment"],
    mutationFn: async (comment: TComment) => {
      return await axios.post(
        "/api/upvote-comment",
        {},
        { params: { commentId: comment.id }, signal: controller.signal },
      );
    },
    onMutate: async ({ id: commentId, rootCommentId }) => {
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.Comments, postId],
      });
      const previousComments = queryClient.getQueryData([
        QueryKeys.Comments,
        postId,
      ]);

      queryClient.setQueryData<InfiniteData<TPage<TComment[]>>>(
        [QueryKeys.Comments, postId],
        (oldData) => {
          const newData = oldData
            ? {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  if (page) {
                    return {
                      ...page,
                      data: page.data.map((comment) => {
                        let updatedComment;

                        //if the user upvoted a reply
                        if (rootCommentId) {
                          updatedComment =
                            rootCommentId === comment.id
                              ? {
                                  ...comment,
                                  commentReplies: comment.commentReplies.map(
                                    (reply) =>
                                      reply.id === commentId
                                        ? {
                                            ...reply,
                                            upvoteCount:
                                              comment.upvoteCount + 1,
                                            isUpvoted: true,
                                          }
                                        : reply,
                                  ),
                                }
                              : comment;
                          return updatedComment;
                        }

                        //if the user upvoted a comment
                        updatedComment =
                          commentId === comment.id
                            ? {
                                ...comment,
                                upvoteCount: comment.upvoteCount + 1,
                                isUpvoted: true,
                              }
                            : comment;

                        return updatedComment;
                      }),
                    };
                  }

                  return page;
                }),
              }
            : oldData;

          return newData;
        },
      );

      return { previousComments };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        [QueryKeys.Comments, postId],
        context?.previousComments,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Comments, postId],
      });
    },
  });
}

export function useRemoveUpvoteComment() {
  const queryClient = useQueryClient();
  const controller = new AbortController();
  const { postTitle: title } = useParams<{ postTitle: string }>();
  const postId = title.split("-").at(-1);

  return useMutation({
    mutationKey: ["removeUpvoteComment"],
    mutationFn: async (comment: TComment) => {
      return await axios.delete("/api/upvote-comment", {
        params: { commentId: comment.id },
        signal: controller.signal,
      });
    },
    onMutate: async ({ id: commentId, rootCommentId }) => {
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.Comments, postId],
      });
      const previousComments = queryClient.getQueryData([
        QueryKeys.Comments,
        postId,
      ]);

      queryClient.setQueryData<InfiniteData<TPage<TComment[]>>>(
        [QueryKeys.Comments, postId],
        (oldData) => {
          const newData = oldData
            ? {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  if (page) {
                    return {
                      ...page,
                      data: page.data.map((comment) => {
                        let updatedComment;

                        //if the user upvoted a reply
                        if (rootCommentId) {
                          updatedComment =
                            rootCommentId === comment.id
                              ? {
                                  ...comment,
                                  commentReplies: comment.commentReplies.map(
                                    (reply) =>
                                      reply.id === commentId
                                        ? {
                                            ...reply,
                                            upvoteCount:
                                              comment.upvoteCount - 1,
                                            isUpvoted: false,
                                          }
                                        : reply,
                                  ),
                                }
                              : comment;
                          return updatedComment;
                        }

                        //if the user upvoted a comment
                        updatedComment =
                          commentId === comment.id
                            ? {
                                ...comment,
                                upvoteCount: comment.upvoteCount - 1,
                                isUpvoted: false,
                              }
                            : comment;

                        return updatedComment;
                      }),
                    };
                  }

                  return page;
                }),
              }
            : oldData;

          return newData;
        },
      );

      return { previousComments };
    },
    onError: (error, postId, context) => {
      queryClient.setQueryData(
        [QueryKeys.Comments, postId],
        context?.previousComments,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Comments, postId],
      });
    },
  });
}
