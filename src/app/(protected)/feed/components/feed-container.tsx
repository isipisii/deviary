"use client";

import BlogPostCard from "@/components/shared/blog-post-card";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useGetFeedPosts } from "@/lib/services/post.api";
import DiaryCard from "@/components/shared/diary-card";
import PostsSkeletonLoader from "@/components/shared/skeleton-loaders/posts-skeleton-loader";
import CardContainer from "@/components/layout/card-container";

export default function FeedContainer() {
  const { ref, inView } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage, data, isLoading } =
    useGetFeedPosts();

  useEffect(() => {
    // checks if the last element that has the ref and if theres next page in order to
    // fetch the next page
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <CardContainer>
        {data?.pages.map(
          (page) =>
            page.data?.map((post, index) => {
              // this is for the last element in order to put the ref for infinite scrolling
              if (page.data.length === index + 1) {
                if (post.type === "BLOG_POST") {
                  return (
                    <div ref={ref} key={post.id} className="w-full">
                      <BlogPostCard post={post} />
                    </div>
                  );
                }
                return (
                  <div ref={ref} key={post.id} className="w-full">
                    <DiaryCard post={post} />
                  </div>
                );
              }

              if (post.type === "BLOG_POST") {
                return <BlogPostCard post={post} key={post.id} />;
              }
              return <DiaryCard post={post} key={post.id} />;
            }),
        )}
        {isLoading && <PostsSkeletonLoader />}
        {isFetchingNextPage && <PostsSkeletonLoader isInInfinite />}
      </CardContainer>
    </div>
  );
}
