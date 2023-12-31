import PageTitle from "@/components/ui/page-title";
import { getBookmarks } from "@/lib/services/bookmark.api";
import { QueryKeys } from "@/lib/constants";
import BookmarksContainer from "./components/bookmarks-container";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

export default async function BookMarkpage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: [QueryKeys.Bookmarks],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getBookmarks(5, lastCursor),
    getNextPageParam: (lastPage: TPage<TBookmark[]>) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
  });

  return (
    <div className="p-12">
      <PageTitle>Bookmarks</PageTitle>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BookmarksContainer />
      </HydrationBoundary>
    </div>
  );
}
