"use client";

import FeedContainer from "../../feed/components/feed-container";
import { useSearchParams } from "next/navigation";
import { useSearchPosts } from "@/lib/services/search.api";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import PostsSkeletonLoader from "@/components/shared/skeleton-loaders/posts-skeleton-loader";
import CardContainer from "@/components/layout/card-container";
import BlogPostCard from "@/components/shared/blog-post-card";
import DiaryCard from "@/components/shared/diary-card";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function SearchContainer() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") as string;
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const { data: posts, refetch, isLoading } = useSearchPosts(debouncedQuery);

  useEffect(() => {
    if (debouncedQuery) {
      refetch();
    }
  }, [refetch, debouncedQuery]);

  if (!debouncedQuery) {
    return <FeedContainer />;
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      {posts && posts.length === 0 ? (
        <div className="grid h-[60vh] place-items-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-[5rem] text-navTextColor">
              <FaMagnifyingGlass />
            </p>
            <p className="text-center text-sm font-medium text-navTextColor md:text-base">
              No results found.
            </p>
          </div>
        </div>
      ) : (
        <CardContainer>
          {posts?.map((post) => {
            if (post.type === "BLOG_POST") {
              return <BlogPostCard post={post} key={post.id} />;
            }
            return <DiaryCard post={post} key={post.id} />;
          })}
          {isLoading && <PostsSkeletonLoader />}
        </CardContainer>
      )}
    </div>
  );
}
