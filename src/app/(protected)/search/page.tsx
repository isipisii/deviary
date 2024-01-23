import PageTitle from "@/components/ui/page-title";
import { QueryKeys } from "@/lib/constants";
import { getFeedPosts } from "@/lib/services/post.api";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import SearchContainer from "./components/search-container";
import SearchField from "./components/search-field";

export default async function SearchPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: [QueryKeys.Posts],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getFeedPosts(5, lastCursor),
    getNextPageParam: (lastPage: TPage<TPost[]>) => lastPage.metaData ? lastPage?.metaData.lastCursor : null,
  })

  return (
    <div className="p-6 md:p-12">
      <div className="flex gap-4 flex-col">
        <PageTitle>Search</PageTitle>
        <SearchField />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchContainer />
      </HydrationBoundary>
    </div>
  );
}
