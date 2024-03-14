import React from 'react'
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query'
import PageTitle from '@/components/ui/page-title'
import ReadingHistoriesContainer from './components/reading-histories-container'
import { QueryKeys } from '@/lib/constants'
import { getReadingHistories } from '@/lib/services/reading-history.api'

export default async function HistoryPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: [QueryKeys.ReadingHistories],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getReadingHistories(5, lastCursor),
    getNextPageParam: (lastPage: TPage<TReadingHistory[]>) => lastPage.metaData ? lastPage?.metaData.lastCursor : null,
  })

  return (
    <div className="p-6 md:p-12">
      <div className="flex items-center justify-between">
        <PageTitle>History</PageTitle>
        {/* <FilterPopover type="FEED_POSTS" /> */}
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ReadingHistoriesContainer />
      </HydrationBoundary>
    </div>
  )
}
