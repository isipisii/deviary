import PageTitle from "@/components/ui/page-title";
import { QueryKeys } from "@/lib/constants";
import { getPopularPosts } from "@/lib/services/post.api";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import PopularPostsContainer from "./components/popular-posts-container"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deviary | Popular",
  description: `a developer's diary and community`,
};


export default async function PopularPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: [QueryKeys.PopularPosts],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getPopularPosts(5, lastCursor),
    getNextPageParam: (lastPage) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
    pages: 3,
  });

  return (
    <div className="p-6 md:p-12">
      <PageTitle>Popular🔥</PageTitle>
      <HydrationBoundary state={dehydrate(queryClient)}>
       <PopularPostsContainer />
      </HydrationBoundary>
    </div>
  );
}
