"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import CardContainer from "@/components/layout/card-container";
import { useGetGuilds } from "@/lib/services/guild.api";
import GuildCard from "@/components/shared/guild-card";
import GuildCardsSkeleton from "@/components/skeleton-loaders/guild-cards-skeleton";

export default function GuildsContainer() {
  const { ref, inView } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage, data, isLoading } =
    useGetGuilds();

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
            page.data?.map((guild, index) =>
              index + 1 === page.data.length ? (
                <div key={index} ref={ref} className="w-full max-w-[350px]">
                  <GuildCard guild={guild} />
                </div>
              ) : (
                <GuildCard guild={guild} key={index} />
              ),
            ),
        )}

        {isLoading && <GuildCardsSkeleton />}
        {isFetchingNextPage && <GuildCardsSkeleton />}
      </CardContainer>
    </div>
  );
}
