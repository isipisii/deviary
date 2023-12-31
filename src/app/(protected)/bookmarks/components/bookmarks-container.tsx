"use client";
import CardContainer from "@/components/ui/card-container";
import { useGetBookmarks } from "@/lib/services/bookmark.api";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import BlogPostCard from "@/components/shared/blog-post-card";
import DiaryCard from "@/components/shared/diary-card";
import PostsSkeletonLoader from "@/components/shared/skeleton-loaders/posts-skeleton-loader";

export default function BookmarksContainer() {
  const { 
    data, 
    hasNextPage, 
    fetchNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useGetBookmarks();
  const { ref, inView } = useInView();

  useEffect(() => {
    //checks if the last element that has the ref and if theres next page in order to
    //fetch the next page
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  return (
    <div>
      <CardContainer>
        {data?.pages.map((page) =>
          page.data?.map((bookmark, index) => {
            // this is for the last element in order to put the ref for infinite scrolling
            if (page.data.length === index + 1) {
              if (bookmark.post.type === "BLOG_POST") {
                return (
                  <div ref={ref} key={bookmark.id}>
                    <BlogPostCard post={bookmark.post} />
                  </div>
                );
              }
              return (
                <div ref={ref} key={bookmark.id}>
                  <DiaryCard post={bookmark.post} />
                </div>
              );
            } 

            if (bookmark.post.type === "BLOG_POST") {
              return <BlogPostCard post={bookmark.post} key={bookmark.id} />;
            }
            return <DiaryCard post={bookmark.post} key={bookmark.id} />;
          })
        )}
        {(isLoading || isFetchingNextPage) && <PostsSkeletonLoader />}
      </CardContainer>
    </div>
  );
}
