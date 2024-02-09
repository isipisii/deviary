import PageTitle from "@/components/ui/page-title";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { getPostsByTag } from "@/lib/services/tag.api";
import { QueryKeys } from "@/lib/constants";
import PostsByTagContainer from "../component/PostsByTagContainer"

export default async function TagsPage({ params }: { params: {tagName: string }}) {
  const queryClient = new QueryClient();
  const tagName = params.tagName

  await queryClient.prefetchInfiniteQuery({
    queryKey: [QueryKeys.PostsByTag, tagName],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getPostsByTag(lastCursor, 5,tagName),
    getNextPageParam: (lastPage: TPage<TPost[]>) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
    pages: 3,
  });

  return (
    <div className="p-6 md:p-12">
      <PageTitle>#{tagName}</PageTitle>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostsByTagContainer />
      </HydrationBoundary>
    </div>
  );
}
