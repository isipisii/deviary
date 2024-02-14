/* eslint-disable @next/next/no-img-element */
"use client";

import { useGetGuildById } from "@/lib/services/guild.api";
import { useParams } from "next/navigation";
import GuildDetailsSkeleton from "@/components/skeleton-loaders/guild-details-skeleton";
import GuildDetails from "./guild-details";

export default function Guild() {
  const { guildId } = useParams() as { guildId: string };
  const { data: guild, isLoading, isError } = useGetGuildById(guildId);

  return (
    <div className="relative h-screen w-full overflow-x-hidden">
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
      {guild && (
        <GuildDetails guild={guild} />
      )}
    </div>
  );
}
