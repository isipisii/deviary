/* eslint-disable @next/next/no-img-element */
import FeedContainer from "./components/feed-container";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getFeedPosts } from "@/lib/services/post.api";
import FilterDropdown from "@/components/ui/filter-dropdown";

export default async function Feed() {
  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts"],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getFeedPosts(5, lastCursor),
    getNextPageParam: (lastPage: TFeedPostsPage) => lastPage.metaData ? lastPage?.metaData.lastCursor : null,
  })

  return (
    <div className="p-12">
        <div className="flex items-center justify-between">
            <h2 className="font-semibold text-3xl">Feed</h2>
            <FilterDropdown />
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <FeedContainer />
        </HydrationBoundary>
    </div>
  )
}


