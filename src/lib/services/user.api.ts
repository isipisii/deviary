import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../constants";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { updateRoute } from "../actions";

export function useUpdateUserProfile(updateSessionAndToken: (data?: any) => Promise<Session | null>) {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["updateUserProfile"],
    mutationFn: async ({ formData, userId }: { formData: FormData; userId: string }) => {
      const res = await axios.patch(`/api/users/${userId}`, formData)
      return res.data.updatedUser as TUser
    },
    onSuccess: async (user) => {
      // updates the session in client and jwt in server 
      await updateSessionAndToken({ name: user.name, image: user.image, onboarded: user.onboarded })

      await queryClient.invalidateQueries({queryKey: [QueryKeys.User, user.id]})
      await queryClient.invalidateQueries({queryKey: [QueryKeys.PostsByAuthor, null, user.id]})
      await queryClient.invalidateQueries({queryKey: [QueryKeys.PostsByAuthor, "CODE_DIARY", user.id]})
      await queryClient.invalidateQueries({queryKey: [QueryKeys.PostsByAuthor, "BLOG_POST", user.id]})

      toast.success("Profile updated")  
      updateRoute("/settings/profile")
      router.push(`/profile/${user.id}`)
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message)
    },
  })
}

export async function  getUserById(userId: string) {
  const res = await axios.get(`/api/users/${userId}`)
  return res.data.user as TUser
}

export function useGetUserById(userId: string) {
  return useQuery({
    queryKey: [QueryKeys.User, userId],
    queryFn: () => getUserById(userId),
  })
}

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