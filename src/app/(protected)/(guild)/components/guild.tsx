/* eslint-disable @next/next/no-img-element */
"use client";

import { useGetGuildById } from "@/lib/services/guild.api";
import { useParams } from "next/navigation";
import GuildDetailsSkeleton from "@/components/skeleton-loaders/guild-details-skeleton";
import GuildDetails from "./guild-details";
import GuildSharedPostsContainer from "./guild-shared-posts-container";
import { CiLock } from "react-icons/ci";

export default function Guild() {
  const { guildId } = useParams<{ guildId: string }>();
  const { data: guild, isLoading, isError } = useGetGuildById(guildId);

  return (
    <div className="relative w-full overflow-x-hidden">
      {/* radial gradients */}
      <div
        className="absolute -right-[10rem] -top-[20rem] z-0 h-[600px] w-[800px] opacity-30"
        style={{
          backgroundImage: `radial-gradient(600px circle, #1E00FF, transparent 50%, transparent)`,
        }}
      />
      <div
        className="absolute -right-[25rem] -top-[8rem] z-0 h-[600px] w-[800px]  opacity-30"
        style={{
          backgroundImage: `radial-gradient(600px circle, #DD0DB9, transparent 50%, transparent)`,
        }}
      />
      {isLoading && <GuildDetailsSkeleton />}
      {/* guild details */}
      {guild && <GuildDetails guild={guild} />}
      {guild?.isBelong && <GuildSharedPostsContainer guildId={guildId} />}
      {!guild?.isBelong && guild && (
        <div className="flex h-[300px] w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-[4rem] text-navTextColor">
              <CiLock />
            </p>
            <div className="space-y-2">
              <h3 className="text-center text-lg font-semibold text-navTextColor md:text-xl">
                This guild is private
              </h3>
              <p className="text-center  text-xs font-medium text-navTextColor/80 md:text-sm">
                Request to join.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
