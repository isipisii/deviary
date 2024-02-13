// import { getGuildById } from "@/lib/actions"
import Guild from "../../components/guild";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { QueryKeys } from "@/lib/constants";
import { getGuildById } from "@/lib/services/guild.api";

export default async function GuildPage({
  params,
}: {
  params: { guildId: string };
}) {
  const queryClient = new QueryClient();
  const guildId = params.guildId;

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys, guildId],
    queryFn: async () => getGuildById(guildId),
  });
  // const guild = await getGuildById(params.guildId)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Guild />
    </HydrationBoundary>
  );
}
