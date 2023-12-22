"use client";

import BlogPostCard from "@/components/shared/blog-post-card";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useFeedPosts } from "@/lib/services/post.api";

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
      <div className="flex gap-12 flex-wrap mt-8 ">
        {data?.pages.map((page) =>
          page.posts?.map((post, index) => {
            // this is for the last element in order to put the ref for infinite scrolling
            if (page.posts.length === index + 1) {
              if(post.type === "BLOG_POST") {
                return (
                  <div ref={ref} key={index}>
                    <BlogPostCard post={post} />
                  </div>
                )
              }
              return (
                <div ref={ref} key={index}>
                  <div className="h-[200px] border">
                    <h1>{post.id}</h1>
                    <h1>{post.diary?.title}</h1>
                    <h1>{post.type}</h1>
                    <h1>{index + 1}</h1>
                    {post.tags.map((tag, index) => (
                      <h1 key={index}>{tag}</h1>
                    ))}
                  </div>
                </div>
              );
            } else {
              if(post.type === "BLOG_POST") {
                return (
                  <div ref={ref} key={index}>
                    <BlogPostCard post={post} />
                  </div>
                )
              }
              return (
                <div className="h-[200px] border" key={index}>
                  <h1>{post.id}</h1>
                  <h1>{post.type}</h1>
                  <h1>{post.diary?.title}</h1>
                  <h1>{index + 1}</h1>
                  {post.tags.map((tag, index) => (
                    <h1 key={index}>{tag}</h1>
                  ))}
                </div>
              );
            }
          })
        )}
      </div>
      {(isLoading || isFetchingNextPage) && (
        <p className="mb-4">Loading...</p>
      )}
    </div>
  );
}
