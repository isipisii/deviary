/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Avatar, Button } from "@nextui-org/react";
import CustomAvatarGroup from "../ui/custom-avatar-group";
import {
  useJoinGuild,
  useJoinRequestGuild,
  useRemoveJoinRequest,
} from "@/lib/services/guild.api";
import{ useRouter } from "next/navigation"

export default function GuildCard({ guild }: { guild: TGuild }) {
  const router = useRouter()
  const { mutate: joinGuildMutation, isPending: joiningGuild } = useJoinGuild();
  const { mutate: joinRequestGuildMutation, isPending: isSendingRequest } =
    useJoinRequestGuild();
  const { mutate: removeJoinRequestMutation, isPending: isRemovingRequest } =
    useRemoveJoinRequest();
  const isPending = joiningGuild || isSendingRequest || isRemovingRequest;

  function handleJoinGuild() {
    if (!guild.isPrivate) {
      joinGuildMutation(guild.id);
      return;
    }

    if (guild.hasAnExistingJoinRequest) {
      removeJoinRequestMutation(guild.id);
      return;
    }

    joinRequestGuildMutation(guild.id);
  }

  return (
    <Link href={`/guilds/${guild.id}`} className="w-full max-w-[350px]">
      <div className="relative flex h-[400px] w-full max-w-[350px] items-end justify-center overflow-hidden rounded-3xl border-2 border-borderColor bg-cardBg p-4 shadow-xl">
        {/* gradients */}
        <div
          className="absolute -right-[10rem] -top-[20rem] z-0 h-[600px] w-[800px] opacity-20"
          style={{
            backgroundImage: `radial-gradient(500px circle, #1E00FF, transparent 50%, transparent)`,
          }}
        />
        <div
          className="absolute -right-[25rem] -top-[8rem] z-0 h-[600px] w-[800px]  opacity-20"
          style={{
            backgroundImage: `radial-gradient(500px circle, #DD0DB9, transparent 50%, transparent)`,
          }}
        />
        <div className="absolute left-0 top-0 z-[4] h-full w-full bg-background opacity-30 backdrop-blur-xl" />

        {/* card details */}
        <div className="z-[5] flex h-full w-full flex-col justify-between gap-4">
          <div className="flex w-full flex-col">
            <CustomAvatarGroup
              members={guild.members}
              totalMembersCount={guild.membersCount}
            />
            <div className="flex items-center gap-3">
              <Avatar
                src={guild.image.imageUrl}
                isBordered
                className="h-[80px] w-[80px] object-cover"
              />
              <div>
                <h2 className="text-xl font-bold">{guild.name}</h2>
                <p className="text-sm">
                  @{guild.name.toLowerCase().replaceAll(" ", "")}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-navTextColor">
              {guild.description}
            </p>
          </div>
          {guild.isBelong ? (
            <Button
              className="rounded-xl font-semibold hover:text-white w-full"
              color="secondary"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault()
                e.nativeEvent.stopImmediatePropagation();
                router.push(`/guilds/${guild.id}`)
              }}
            >
              View Guild
            </Button>
          ) : (
            <Button
              className="rounded-xl font-semibold hover:text-white"
              color="secondary"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
                handleJoinGuild();
              }}
              isLoading={isPending}
            >
              {(guild.hasAnExistingJoinRequest && "Cancel Request") ||
                (guild.isPrivate && "Request to join") ||
                "Join Guild"}
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}
