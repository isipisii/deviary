"use client";

import { useGetPostsByAuthor } from "@/lib/services/post.api";
import { Tab, Tabs } from "@nextui-org/react";
import { useInView } from "react-intersection-observer";
import {
  useParams,
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaCode } from "react-icons/fa6";
import { RiArticleFill } from "react-icons/ri";
import PostsSkeletonLoader from "@/components/skeleton-loaders/posts-skeleton-loader";
import DiaryCard from "@/components/shared/diary-card";
import BlogPostCard from "@/components/shared/blog-post-card";

// TODO: MAKE THE POST ACTIONS FUNCTIONAL AND CREATE EDIT PROFILE
export default function UserProfileTabs() {
  const [selectedTabItem, setSelectedTabItem] = useState("posts");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab")?.toString();

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedTabItem !== "posts") {
      params.set("tab", selectedTabItem);
    } else {
      params.delete("tab");
    }

    router.replace(`${pathname}?${params.toString()}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTabItem]);

  return (
    <Tabs
      aria-label="Tabs"
      variant="underlined"
      className="w-full"
      classNames={{
        tabList:
          "gap-6  w-full relative rounded-none p-0 border-b border-divider",
        cursor: "w-full bg-secondary h-[3px] rounded-full",
        tab: "max-w-fit px-2 h-12 font-semibold md:text-[1rem] text-[.85rem]",
        tabContent: "group-data-[selected=true]:text-secondary",
      }}
      selectedKey={selectedTabItem}
      onSelectionChange={(selectedTab) =>
        setSelectedTabItem(selectedTab as string)
      }
    >
      <Tab
        key="posts"
        title={
          <div className="flex items-center space-x-2">
            <FaCode />
            <span>Posts</span>
          </div>
        }
      >
        <Posts />
      </Tab>
      <Tab
        key="blog_post"
        title={
          <div className="flex items-center space-x-2">
            <RiArticleFill />
            <span>Blog posts</span>
          </div>
        }
      >
        <BlogPosts selectedTab={currentTab} />
      </Tab>
      <Tab
        key="code_diary"
        title={
          <div className="flex items-center space-x-2">
            <FaCode />
            <span>Diaries</span>
          </div>
        }
      >
        <Diaries selectedTab={currentTab} />
      </Tab>
    </Tabs>
  );
}

function UserProfileCardContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mb-[5rem] mt-6 grid w-full grid-cols-1 place-items-center gap-8 md:mb-0 md:grid-cols-2">
      {children}
    </div>
  );
}

function Posts() {
  const { userId } = useParams<{ userId: string }>();
  const { ref, inView } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage, data, isLoading } =
    useGetPostsByAuthor(userId);

  useEffect(() => {
    // checks if the last element that has the ref and if theres next page in order to
    // fetch the next page
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  return (
    <UserProfileCardContainer>
      {data?.pages.map(
        (page) =>
          page.data?.map((post, index) => {
            // this is for the last element in order to put the ref for infinite scrolling
            if (page.data.length === index + 1) {
              if (post.type === "BLOG_POST") {
                return (
                  <div ref={ref} key={post.id} className="w-full max-w-[350px]">
                    <BlogPostCard post={post} />
                  </div>
                );
              }
              return (
                <div ref={ref} key={post.id} className="w-full max-w-[350px]">
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
      {(isFetchingNextPage || isLoading) && <PostsSkeletonLoader />}
    </UserProfileCardContainer>
  );
}

function BlogPosts({ selectedTab }: { selectedTab?: string }) {
  const { userId } = useParams<{ userId: string }>();
  const { ref, inView } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage, data, isLoading } =
    useGetPostsByAuthor(userId, "BLOG_POST");

  useEffect(() => {
    // checks if the last element that has the ref and if theres next page in order to
    // fetch the next page
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  return (
    <UserProfileCardContainer>
      {data?.pages.map(
        (page) =>
          page.data?.map((post, index) => {
            if (index + 1 === page.data.length) {
              return (
                <div ref={ref} key={post.id} className="w-full max-w-[350px]">
                  <BlogPostCard post={post} key={post.id} />
                </div>
              );
            }
            return <BlogPostCard post={post} key={post.id} />;
          }),
      )}
      {(isFetchingNextPage || isLoading) && <PostsSkeletonLoader />}
    </UserProfileCardContainer>
  );
}

function Diaries({ selectedTab }: { selectedTab?: string }) {
  const { userId } = useParams<{ userId: string }>();
  const { ref, inView } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage, data, isLoading } =
    useGetPostsByAuthor(userId, "CODE_DIARY");

  useEffect(() => {
    // checks if the last element that has the ref and if theres next page in order to
    // fetch the next page
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  return (
    <UserProfileCardContainer>
      {data?.pages.map(
        (page) =>
          page.data?.map((post, index) => {
            if (index + 1 === page.data.length) {
              return (
                <div ref={ref} key={post.id} className="w-full max-w-[350px]">
                  <DiaryCard post={post} key={post.id} />
                </div>
              );
            }
            return <DiaryCard post={post} key={post.id} />;
          }),
      )}
      {(isFetchingNextPage || isLoading) && <PostsSkeletonLoader />}
    </UserProfileCardContainer>
  );
}
