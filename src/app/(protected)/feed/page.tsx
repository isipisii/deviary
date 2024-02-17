/* eslint-disable @next/next/no-img-element */
import FeedContainer from "./components/feed-container";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getFeedPosts } from "@/lib/services/post.api";
import FilterDropdown from "@/components/ui/filter-dropdown";
import { QueryKeys } from "@/lib/constants";
import PageTitle from "@/components/ui/page-title";

export default async function Feed() {
  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: [QueryKeys.Posts],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getFeedPosts(5, lastCursor),
    getNextPageParam: (lastPage) => lastPage.metaData ? lastPage?.metaData.lastCursor : null,
    pages: 3
  })

  return (
    <div className="p-6 md:p-12">
      <div className="flex items-center justify-between">
        <PageTitle>Feed</PageTitle>
        <FilterDropdown />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FeedContainer />
      </HydrationBoundary>
    </div>
  )
}


