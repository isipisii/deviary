import PageTitle from "@/components/ui/page-title";
import { getBookmarks } from "@/lib/services/bookmark.api";
import { QueryKeys } from "@/lib/constants";
import BookmarksContainer from "./components/bookmarks-container";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deviary | Bookmarks",
  description: `a developer's diary and community`,
};

export default async function BookMarkPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: [QueryKeys.Bookmarks],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getBookmarks(5, lastCursor),
    getNextPageParam: (lastPage: TPage<TBookmark[]>) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
    pages: 3,
  });

  return (
    <div className="p-6 md:p-12">
      <PageTitle>Bookmarks</PageTitle>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BookmarksContainer />
      </HydrationBoundary>
    </div>
  );
}
