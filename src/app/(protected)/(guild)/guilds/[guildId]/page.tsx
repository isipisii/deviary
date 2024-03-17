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
import GuildModalsProvider from "@/components/providers/guild-modals-provider";
import { Metadata, ResolvingMetadata } from "next";
import { db } from "@/lib/prisma";

type Props = {
  params: { guildId: string }
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
 
  const guild = await db.guild.findUnique({
    where: {
      id: params.guildId
    }
  })

  return {
    title: "Deviary | " + guild?.name,
    description: `a developer's diary and community`,
  }
}

export default async function GuildPage({
  params,
}: {
  params: { guildId: string };
}) {
  const queryClient = new QueryClient();
  const guildId = params.guildId;

  await Promise.all([
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.Guild, guildId],
      queryFn: async () => getGuildById(guildId),
    }),
    await queryClient.prefetchInfiniteQuery({
      queryKey: [QueryKeys.GuildSharedPosts],
      initialPageParam: "",
      queryFn: ({ pageParam: lastCursor }) =>
        getGuildSharedPosts(lastCursor, 5, guildId),
      getNextPageParam: (lastPage) =>
        lastPage.metaData ? lastPage?.metaData.lastCursor : null,
      pages: 3,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GuildModalsProvider>
        <Guild />
      </GuildModalsProvider>
    </HydrationBoundary>
  );
}
