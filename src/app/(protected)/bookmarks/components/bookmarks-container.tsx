"use client";

import CardContainer from "@/components/layout/card-container";
import { useGetBookmarks } from "@/lib/services/bookmark.api";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import BlogPostCard from "@/components/shared/blog-post-card";
import DiaryCard from "@/components/shared/diary-card";
import PostsSkeletonLoader from "@/components/skeleton-loaders/posts-skeleton-loader";
import { LuBookmark } from "react-icons/lu";
import { Button } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";

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

  if (Array.isArray(data?.pages[0])) {
    return (
      <div className="grid h-[70vh] place-items-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-[5rem] text-navTextColor">
            <LuBookmark />
          </p>
          <div className="space-y-2">
            <h3 className="text-center text-2xl font-semibold text-navTextColor md:text-3xl">
              No bookmarks.
            </h3>
            <p className="text-center text-sm font-medium text-navTextColor md:text-base">
              It seems like you haven&apos;t bookmarked any posts yet.
            </p>
          </div>

          <Button
            color="secondary"
            variant="light"
            className="font-semibold"
            size="md"
            onClick={() => router.push("/feed")}
          >
            Explore?
          </Button>
        </div>
      </div>
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
