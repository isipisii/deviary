import PageTitle from "@/components/ui/page-title";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { getPostsByTag } from "@/lib/services/tag.api";
import { QueryKeys } from "@/lib/constants";
import PostsByTagContainer from "../component/PostsByTagContainer"
import { Metadata } from "next";

type Props = {
  params: { tagName: string }
}

export function generateMetadata(
  { params }: Props,
): Metadata {
  return {
    title: `Deviary | Tag: ${params.tagName}`,
    description: `a developer's diary and community`,
  }
}

export default async function TagsPage({ params }: { params: {tagName: string }}) {
  const queryClient = new QueryClient();
  const tagName = params.tagName

  await queryClient.prefetchInfiniteQuery({
    queryKey: [QueryKeys.PostsByTag, tagName],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getPostsByTag(lastCursor, 5,tagName),
    getNextPageParam: (lastPage) =>
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
