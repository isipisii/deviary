// import { getGuildById } from "@/lib/actions"
import Guild from "../../components/guild";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { QueryKeys } from "@/lib/constants";
import { getGuildById } from "@/lib/services/guild.api";
import { getGuildSharedPosts } from "@/lib/services/guild-shared-posts.api";

export default async function GuildPage({
  params,
}: {
  params: { guildId: string };
}) {
  const queryClient = new QueryClient();
  const guildId = params.guildId;

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.Guild, guildId],
    queryFn: async () => getGuildById(guildId),
  });

  await queryClient.prefetchInfiniteQuery({
    queryKey: [QueryKeys.GuildSharedPosts],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getGuildSharedPosts(lastCursor, 5, guildId),
    getNextPageParam: (lastPage) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
    pages: 3,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Guild />
    </HydrationBoundary>
  );
}
