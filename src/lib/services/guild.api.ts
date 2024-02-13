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
  const res = await axios.get(`/api/guild/${guildId}`)
  return res.data.guild as TGuild
}

export function useGetGuildById(guildId: string){
  return useQuery({
    queryKey: [QueryKeys.Guild, guildId],
    queryFn: async () => getGuildById(guildId),
  })
}


export function useCreateGuild() {
  const router = useRouter();
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (guildData: FormData) => {
      const res = await axios.post("/api/guild", guildData);
      return res.data.guild as TGuild;
    },
    onSuccess: async (newGuild) => {
      await queryClient.invalidateQueries({queryKey: [QueryKeys.MyGuilds]})
      router.push(`/guilds/${newGuild.id}`);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message);
    },
  });
}

export function useEditGuild() {
  const router = useRouter();
  const queryClient = useQueryClient()

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
      await queryClient.invalidateQueries({queryKey: [QueryKeys.MyGuilds]})
      router.push(`/guilds/${updatedGuild.id}`);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message);
    },
  });
}

export function useGetMyGuilds() {
  return useQuery({
    queryKey: [QueryKeys.MyGuilds],
    queryFn: async () => {
      const res = await axios.get("/api/guild/belong");
      return res.data.guilds as { guild: TGuild }[];
    },
  });
}

// for public guilds
export function useJoinGuild(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (guildId: string) => {
      return await axios.post("/api/guild/join", null, { params: {
        guildId
      }});
    },
    onSuccess: async (updatedGuild) => {
      await queryClient.invalidateQueries({queryKey: [QueryKeys.MyGuilds]}) 
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message);
    },
  })
}

export function useJoinRequestGuild(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (guildId: string) => {
      return await axios.post("/api/guild/join-request", null, { params: {
        guildId
      }});
    },
    // TODO
    onSuccess: async () => {
      
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.message);
    },
  })
}

export function useRemoveJoinRequest(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (guildId: string) => {
      return await axios.delete("/api/guild/join-request", { params: {
        guildId
      }});
    },
    // TODO
    onSuccess: async () => {
      
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.message);
    },
  })
}

export function useAcceptJoinRequest(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (joinRequestId: string) => {
      return await axios.delete("/api/guild/join-request/accept", { params: {
        joinRequestId
      }});
    },
    // TODO
    onSuccess: async () => {
      
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.message);
    },
  })
}

