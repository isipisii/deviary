"use client";

import CardContainer from "@/components/layout/card-container";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import BlogPostCard from "@/components/shared/blog-post-card";
import DiaryCard from "@/components/shared/diary-card";
import PostsSkeletonLoader from "@/components/skeleton-loaders/posts-skeleton-loader";
import { useRouter } from "next/navigation";
import { useGetReadingHistories } from "@/lib/services/reading-history.api";
import EmptyState from "@/components/shared/empty-state";
import { LuHistory } from "react-icons/lu";

export default function ReadingHistoriesContainer() {
  const router = useRouter();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useGetReadingHistories();
  const { ref, inView } = useInView();

  useEffect(() => {
    //checks if the last element that has the ref and if theres next page in order to
    //fetch the next page
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  /*this is the shape of pages if its empty: Array [ [] ], so in order to 
  check if theres no histories is to check if its 1st element is an array 
  since it should be an empty page object*/
  if (Array.isArray(data?.pages[0])) {
    return (
      <EmptyState
        header="No reading history."
        description="It seems like you haven't read any posts yet."
        buttonText="Read?"
        Icon={LuHistory}
      />
    );
  }

  return (
    <CardContainer>
      {data?.pages.map(
        (page) =>
          page.data?.map((readingHistory, index) => {
            // this is for the last element in order to put the ref for infinite scrolling
            if (page.data.length === index + 1) {
              if (readingHistory.post.type === "BLOG_POST") {
                return (
                  <div
                    ref={ref}
                    key={readingHistory.id}
                    className="w-full max-w-[350px]"
                  >
                    <BlogPostCard post={readingHistory.post} />
                  </div>
                );
              }
              return (
                <div
                  ref={ref}
                  key={readingHistory.id}
                  className="w-full max-w-[350px]"
                >
                  <DiaryCard post={readingHistory.post} />
                </div>
              );
            }

            if (readingHistory.post.type === "BLOG_POST") {
              return (
                <BlogPostCard
                  post={readingHistory.post}
                  key={readingHistory.id}
                />
              );
            }
            return (
              <DiaryCard post={readingHistory.post} key={readingHistory.id} />
            );
          }),
      )}
      {isLoading && <PostsSkeletonLoader />}
      {isFetchingNextPage && <PostsSkeletonLoader isInInfinite />}
    </CardContainer>
  );
}
