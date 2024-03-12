/* eslint-disable @next/next/no-img-element */
"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import CardContainer from "@/components/layout/card-container";

import { useGetGuildSharedPosts } from "@/lib/services/guild-shared-posts.api";
import GuildSharedPostCard from "./guild-shared-post-card";
import SharedPostCardSkeletons from "@/components/skeleton-loaders/shared-post-card-skeletons";

export default function GuildSharedPostsContainer({
  guildId,
}: {
  guildId: string;
}) {
  const { ref, inView } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage, data, isLoading } =
    useGetGuildSharedPosts(guildId);

  useEffect(() => {
    // checks if the last element that has the ref and if theres next page in order to
    // fetch the next page
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  return (
    <div className="flex w-full flex-col items-center justify-center p-6 md:px-12">
      <CardContainer>
        {data?.pages.map(
          (page) =>
            page.data?.map((sharedPost, index) =>
              index + 1 === page.data.length ? (
                <div key={index} ref={ref} className="w-full max-w-[350px]">
                  <GuildSharedPostCard sharedPost={sharedPost} />
                </div>
              ) : (
                <GuildSharedPostCard sharedPost={sharedPost} key={index} />
              ),
            ),
        )}
        {isLoading && <SharedPostCardSkeletons />}
        {isFetchingNextPage && <SharedPostCardSkeletons />}
      
      </CardContainer>
    </div>
  );
}
