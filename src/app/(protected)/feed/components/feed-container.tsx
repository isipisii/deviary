"use client";

import BlogPostCard from "@/components/shared/blog-post-card";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useFeedPosts } from "@/lib/services/post.api";
import DiaryCard from "@/components/shared/diary-card";
import PostsSkeletonLoader from "@/components/shared/skeleton-loaders/posts-skeleton-loader";

export default function FeedContainer() {
  const { ref, inView } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage, data, isLoading } = useFeedPosts()

  useEffect(() => {
    //checks if the last element that has the ref and if theres next page in order to 
    //fetch the next page
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  return (
    <div className="w-full flex items-center flex-col justify-center">
      <div className="flex gap-12 items-center justify-center flex-wrap mt-8 w-full">
        {data?.pages.map((page) =>
          page.data?.map((post, index) => {
            // this is for the last element in order to put the ref for infinite scrolling
            if (page.data.length === index + 1) {
              if(post.type === "BLOG_POST") {
                return (
                  <div ref={ref} key={index}>
                    <BlogPostCard post={post} />
                  </div>
                )
              }
              return (
                <div ref={ref} key={index}>
                  <DiaryCard post={post}/>
                </div>
              );
            } else {
              if(post.type === "BLOG_POST") {
                return (
                  <BlogPostCard post={post} key={index} />
                )
              }
              return (
                <DiaryCard post={post} key={index} />
              );
            }
          })
        )}
       {(isLoading || isFetchingNextPage) && ( <PostsSkeletonLoader />)}
      </div>
    </div>
  );
}
