import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../constants";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export function useApplyFeedFilter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (filter: string) => {
      return await axios.patch(
        "/api/users/filter-feed-posts",
        {},
        { params: { filter } },
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.CurrentFeedFilter],
      });
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Posts] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message);
    },
  });
}

export function useGetCurrentFeedFilter() {
  return useQuery({
    queryKey: [QueryKeys.CurrentFeedFilter],
    queryFn: async () => {
      const res = await axios.get("/api/users/filter-feed-posts");
      return res.data.currentGuildsFilter.toLowerCase() as TFeedFilter
    },
  });
}

export function useGetCurrentGuildsFilter() {
  return useQuery({
    queryKey: [QueryKeys.CurrentGuildsFilter],
    queryFn: async () => {
      const res = await axios.get("/api/users/filter-guilds");
      return res.data.currentFeedFilter.toLowerCase() as TGuildsFilter
    },
  });
}

export function useApplyGuildsFilter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (filter: string) => {
      return await axios.patch(
        "/api/users/filter-guilds",
        {},
        { params: { filter } },
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.CurrentGuildsFilter],
      });
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Guilds] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message);
    },
  });
}