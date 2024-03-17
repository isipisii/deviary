import PageTitle from "@/components/ui/page-title";
import GuildsContainer from "../components/guilds-container";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getGuilds } from "@/lib/services/guild.api";
import { QueryKeys } from "@/lib/constants";
import FilterPopover from "@/components/ui/filter-popover";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deviary | Guilds",
  description: `a developer's diary and community`,
};

export default async function GuildsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: [QueryKeys.Guilds],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getGuilds(lastCursor, 5),
    getNextPageParam: (lastPage) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
    pages: 3,
  });

  return (
    <div className="p-6 md:p-12">
       <div className="flex items-center justify-between">
        <PageTitle>Guilds</PageTitle>
        <FilterPopover type="GUILDS" />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <GuildsContainer />
      </HydrationBoundary>
    </div>
  );
}
