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
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Posts] });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.CurrentFeedFilter],
      });
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
      return res.data.currentFeedFilter.toLowerCase() as TFeedFilter
    },
  });
}
