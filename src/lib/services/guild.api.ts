import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { QueryKeys } from "../constants";
import { updateRoute } from "../actions";
import { useRouter } from "next/navigation";

export async function getGuildById(guildId: string) {
  const res = await axios.get(`/api/guild/${guildId}`);
  return res.data.guild as TGuild;
}

export async function getGuilds(
  lastCursor: string,
  take: number,
  privacy?: "public" | "private",
) {
  const res = await axios.get("/api/guild", {
    params: { lastCursor, take, privacy },
  });

  return res.data.data as TPage<TGuild[]>;
}

export async function getGuildMembers(
  lastCursor: string,
  take: number,
  guildId: string,
) {
  const res = await axios.get("/api/guild/members", {
    params: { lastCursor, take, guildId },
  });

  return res.data.data as TPage<TGuildMember[]>;
}

export function useGetGuildMembers(guildId: string) {
  return useInfiniteQuery({
    queryKey: [QueryKeys.GuildMembers, guildId],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) =>
      getGuildMembers(lastCursor, 5, guildId),
    getNextPageParam: (lastPage) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
  });
}

export function useGetGuildJoinRequests(guildId: string, isGuildPrivate?: boolean) {
  return useInfiniteQuery({
    queryKey: [QueryKeys.GuildJoinRequests, guildId],
    initialPageParam: "",
    queryFn: async ({ pageParam: lastCursor }) => {
      const res = await axios.get("/api/guild/join-request", {
        params: { lastCursor, take: 5, guildId },
      });

      return res.data.data as TPage<TJoinRequest[]>;
    },
    getNextPageParam: (lastPage) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
    enabled: isGuildPrivate
  });
}

export function useGetGuildById(guildId: string) {
  return useQuery({
    queryKey: [QueryKeys.Guild, guildId],
    queryFn: async () => getGuildById(guildId),
  });
}

export function useGetGuilds() {
  return useInfiniteQuery({
    queryKey: [QueryKeys.Guilds],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getGuilds(lastCursor, 5),
    getNextPageParam: (lastPage) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
  });
}

export function useCreateGuild() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guildData: FormData) => {
      const res = await axios.post("/api/guild", guildData);
      return res.data.guild as TGuild;
    },
    onSuccess: async (newGuild) => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.MyGuilds] });
      router.push(`/guilds/${newGuild.id}`);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message);
    },
  });
}

export function useEditGuild() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      guildData,
      guildId,
    }: {
      guildData: FormData;
      guildId: string;
    }) => {
      const res = await axios.patch(`/api/guild/${guildId}`, guildData);
      return res.data.guild as TGuild;
    },
    onSuccess: async (updatedGuild) => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.MyGuilds] });
      router.push(`/guilds/${updatedGuild.id}`);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message);
    },
  });
}

/** get guilds where the authenticated user belongs */
export function useGetMyGuilds() {
  return useQuery({
    queryKey: [QueryKeys.MyGuilds],
    queryFn: async () => {
      const res = await axios.get("/api/guild/belong");
      return res.data.guilds as { guild: TGuild }[];
    },
  });
}

/** for automatically joining public guilds */
export function useJoinGuild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["joinGuild"],
    mutationFn: async (guildId: string) => {
      return await axios.post("/api/guild/join", null, {
        params: {
          guildId,
        },
      });
    },
    onSuccess: async (data, guildId) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Guild, guildId],
      });
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.MyGuilds] });
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Guilds] });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.GuildMembers, guildId],
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message);
    },
  });
}

export function useLeaveGuild(closeModal: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["leaveGuild"],
    mutationFn: async (guildId: string) => {
      return await axios.delete("/api/guild/leave", {
        params: {
          guildId,
        },
      });
    },
    onSuccess: async (data, guildId) => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Guilds] });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.GuildMembers, guildId],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Guild, guildId],
      });
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.MyGuilds] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message);
    },
    onSettled: () => {
      if (closeModal) closeModal();
    },
  });
}

/** send join request for private guilds */
export function useJoinRequestGuild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["joinRequest"],
    mutationFn: async (guildId: string) => {
      return await axios.post("/api/guild/join-request", null, {
        params: {
          guildId,
        },
      });
    },
    onSuccess: async (data, guildId) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Guild, guildId],
      });
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Guilds] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.log(error);
      toast.error(error.response?.data.message);
    },
  });
}

/** remove join request, this is used by the user who made the request */
export function useRemoveJoinRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["removeJoinRequest"],
    mutationFn: async (guildId: string) => {
      return await axios.delete("/api/guild/join-request", {
        params: {
          guildId,
        },
      });
    },
    onSuccess: async (data, guildId) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Guild, guildId],
      });
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Guilds] });
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.MyGuilds] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message);
    },
  });
}

export function useAcceptJoinRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["acceptJoinRequest"],
    mutationFn: async ({
      joinRequestId,
      guildId,
    }: {
      joinRequestId: string;
      guildId: string;
    }) => {
      return await axios.post("/api/guild/join-request/accept", null, {
        params: {
          joinRequestId,
        },
      });
    },
    onSuccess: async (data, { guildId }) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Notifications],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.GuildMembers, guildId],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Guild, guildId],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.GuildJoinRequests, guildId],
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message);
    },
  });
}

export function useDeclineJoinRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["declineJoinRequest"],
    mutationFn: async ({ joinRequestId  } :{ joinRequestId: string, guildId: string }) => {
      return await axios.delete("/api/guild/join-request/decline", {
        params: {
          joinRequestId,
        },
      });
    },
    onSuccess: async (data, { guildId }) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Notifications],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.GuildJoinRequests, guildId],
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.log(error)
      toast.error(error.response?.data.message);
    },
  });
}

export function useRemoveGuildMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["removeGuildMember"],
    mutationFn: async ({
      memberId,
      guildId,
    }: {
      memberId: string;
      guildId: string;
    }) => {
      return await axios.delete(
        "/api/guild/members/remove",
        {
          params: {
            memberId,
          },
        },
      );
    },
    onSuccess: async (data, { guildId }) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.GuildMembers, guildId],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.Guild, guildId],
      });
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Guilds] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.log(error);
      toast.error(error.response?.data.message);
    },
  });
}

export function useAssignModerator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["assignModerator"],
    mutationFn: async ({
      memberId,
      guildId,
    }: {
      memberId: string;
      guildId: string;
    }) => {
      return await axios.post("/api/guild/members/assign-moderator", {}, {
        params: {
          memberId,
          guildId
        },
      });
    },
    onSuccess: async (data, { guildId }) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.GuildMembers, guildId],
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.log(error)
      toast.error("An error occured while assigning");
    },
  });
}

export function useUnassignModerator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["unassignModerator"],
    mutationFn: async ({
      memberId,
      guildId,
    }: {
      memberId: string;
      guildId: string;
    }) => {
      return await axios.delete("/api/guild/members/assign-moderator", {
        params: {
          memberId,
        },
      });
    },
    onSuccess: async (data, { guildId }) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.GuildMembers, guildId],
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.log(error)
      toast.error("An error occured while assigning");
    },
  });
}

