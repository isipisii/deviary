/* eslint-disable @next/next/no-img-element */
"use client";

import { useGetGuildById } from "@/lib/services/guild.api";
import { Avatar, AvatarGroup, Button } from "@nextui-org/react";
import GuildContextMenu from "./guild-context-menu";
import { useParams } from "next/navigation";
import { AiOutlineUserAdd } from "react-icons/ai";

export default function Guild() {
  const { guildId } = useParams() as { guildId: string };
  const { data: guild, isLoading, isError } = useGetGuildById(guildId);

  if (!guild || isLoading) {
    return <div>Loading</div>;
  }

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

      {/* guild details */}
      <div className="z-[5] grid h-auto w-full place-items-center gap-4 border-b border-borderColor bg-background/30 p-6 backdrop-blur-xl md:p-12 lg:place-items-start ">
        <img
          src={guild?.image.imageUrl}
          alt="guild-avatar"
          className=" h-[120px] w-[120px] rounded-full  bg-foreground object-cover p-1 shadow-sm md:h-[150px] md:w-[150px]"
        />

        <div className="guild-lower">
          <div className="grid place-items-center gap-4 lg:place-items-start">
            <div className="guild-details flex flex-col gap-4">
              <div>
                <h2 className="text-[2rem] font-bold">{guild?.name}</h2>
                <p>@{guild?.name.toLowerCase().replaceAll(" ", "")}</p>
              </div>
              <p className="text-navTextColor">{guild?.description}</p>
            </div>

            <AvatarGroup
              max={5}
              total={guild.membersCount - 5}
              size="sm"
              renderCount={(count) => (
                <p className="ms-2 text-sm font-medium text-foreground">
                  +{count} others
                </p>
              )}
            >
              {guild?.members.map((member) => (
                <Avatar src={member.user.image} key={member.id} />
              ))}
            </AvatarGroup>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="md"
              color="secondary"
              variant={guild.isBelong ? "bordered" : "solid"}
              className={`w-full rounded-xl font-medium ${
                guild.isBelong ? "text-secondary" : "text-white"
              }`}
            >
              {guild.isBelong
                ? "Joined"
                : guild.isPrivate
                  ? "Request to join"
                  : "Join"}
            </Button>

            <Button
              size="md"
              color="secondary"
              className="w-full rounded-xl font-medium text-white"
              isIconOnly
              startContent={<AiOutlineUserAdd className="text-[1.2rem]" />}
            />
            <GuildContextMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
