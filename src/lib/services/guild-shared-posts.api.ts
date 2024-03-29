import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { QueryKeys } from "../constants";

export async function getGuildSharedPosts(
  lastCursor: string,
  take: number,
  guildId: string,
) {
  const res = await axios.get(`/api/guild/shared-posts/${guildId}`, {
    params: { lastCursor, take },
  });
  return res.data.data as TPage<TGuildSharedPost[]>;
}

export function useGetGuildSharedPosts(guildId: string) {
  return useInfiniteQuery({
    queryKey: [QueryKeys.GuildSharedPosts, guildId],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) =>
      getGuildSharedPosts(lastCursor, 5, guildId),
    getNextPageParam: (lastPage) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
  });
}

export function useSharePost(closeModal: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      postId,
      guildId,
    }: {
      content: string;
      guildId: string;
      postId: string;
    }) => {
      return await axios.post(
        "/api/share",
        { content },
        { params: { postId, guildId } },
      );
    },
    onSuccess: async (data, { guildId }) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.GuildSharedPosts, guildId],
      });
      closeModal();
      toast.success("Post has been shared.");
    },
    onError: async (error: AxiosError<ErrorResponse>) => {
      toast.error("An error occured while sharing the post.");
    },
  });
}

export function useUpdateSharedPost(closeModal: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      shareId,
    }: {
      content: string;
      shareId: string;
      guildId: string;
    }) => {
      return await axios.patch(
        "/api/share",
        { content },
        { params: { shareId } },
      );
    },
    onSuccess: async (data, { guildId }) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.GuildSharedPosts, guildId],
      });
      closeModal();
    },
    onError: async (error: AxiosError<ErrorResponse>) => {
      toast.error("An error occured while updating the shared post.");
    },
  });
}

export function useDeleteSharedPost(closeModal: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteSharedPost"],
    mutationFn: async ({ shareId }: { shareId: string; guildId: string }) => {
      return await axios.delete("/api/share", { params: { shareId } });
    },
    onSuccess: async (data, { guildId }) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.GuildSharedPosts, guildId],
      });
      toast.success("Shared post has been deleted.");
      closeModal()
    },
    onError: async (error: AxiosError<ErrorResponse>) => {
      toast.error("An error occured while deleting the shared post.");
    },
  });
}
