import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError }from "axios";
import { QueryKeys } from "../constants";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetNotifications() {
  return useQuery({
    queryKey: [QueryKeys.Notifications],
    queryFn: async () => {
      const res = await axios.get("/api/notifications");

      return res.data.notifications as TNotification[];
    },
    staleTime: 60 * 1000,
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => { 
      return await axios.delete(`/api/notifications/${notificationId}`)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Notifications]})
    },
    onError: (error :AxiosError<ErrorResponse>) => {
      toast.error("An error occured while deleting the notification")
    }
  })
}

export function useViewNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => { 
      return await axios.delete(`/api/notifications/view/${notificationId}`)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Notifications]})
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error("An error occured while deleting the notification")
    }
  })
}

export async function newNotificationOptimisticUpdate(queryClient: QueryClient, newNotification: TNotification) {
  queryClient.setQueryData<TNotification[]>(
    [QueryKeys.Notifications],
    (oldData) => {
      const newData = oldData ? [newNotification, ...oldData] : oldData;
      return newData;
    },
  );
  await queryClient.invalidateQueries({
    queryKey: [QueryKeys.Notifications],
  });
}