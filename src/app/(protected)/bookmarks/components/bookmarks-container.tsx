"use client";

import CardContainer from "@/components/layout/card-container";
import { useGetBookmarks } from "@/lib/services/bookmark.api";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import BlogPostCard from "@/components/shared/blog-post-card";
import DiaryCard from "@/components/shared/diary-card";
import PostsSkeletonLoader from "@/components/skeleton-loaders/posts-skeleton-loader";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/shared/empty-state";
import { LuBookmark } from "react-icons/lu";

export default function BookmarksContainer() {
  const router = useRouter();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useGetBookmarks();
  const { ref, inView } = useInView();

  useEffect(() => {
    //checks if the last element that has the ref and if theres next page in order to
    //fetch the next page
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);


  {/*this is the shape of pages if its empty: Array [ [] ], so in order to 
  check if theres no bookmarks is to check if its 1st element is an array 
  since it should be an empty page object*/}
  if (Array.isArray(data?.pages[0])) {
    return (
      <EmptyState
        header="No bookmarks."
        description="It seems like you haven't bookmarked any posts yet."
        buttonText="Explore?"
        Icon={LuBookmark}
      />
    );
  }

  return (
    <CardContainer>
      {data?.pages.map(
        (page) =>
          page.data?.map((bookmark, index) => {
            // this is for the last element in order to put the ref for infinite scrolling
            if (page.data.length === index + 1) {
              if (bookmark.post.type === "BLOG_POST") {
                return (
                  <div
                    ref={ref}
                    key={bookmark.id}
                    className="w-full max-w-[350px]"
                  >
                    <BlogPostCard post={bookmark.post} />
                  </div>
                );
              }
              return (
                <div
                  ref={ref}
                  key={bookmark.id}
                  className="w-full max-w-[350px]"
                >
                  <DiaryCard post={bookmark.post} />
                </div>
              );
            }

            if (bookmark.post.type === "BLOG_POST") {
              return <BlogPostCard post={bookmark.post} key={bookmark.id} />;
            }
            return <DiaryCard post={bookmark.post} key={bookmark.id} />;
          }),
      )}
      {isLoading && <PostsSkeletonLoader />}
      {isFetchingNextPage && <PostsSkeletonLoader isInInfinite />}
    </CardContainer>
  );
}
