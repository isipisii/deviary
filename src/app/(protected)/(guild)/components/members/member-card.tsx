"use client";

import formatDate from "@/utils/formatDate";
import { Avatar, Button } from "@nextui-org/react";
import { useRemoveGuildMember } from "@/lib/services/guild.api";

export default function MemberCard({
  guildMember,
}: {
  guildMember: TGuildMember;
}) {
  const { user, id, createdAt, role, guildId } = guildMember;
  const { mutate: removeMemberMutation, isPending: isRemovingMember } =
    useRemoveGuildMember();

  return (
    <div className="flex w-full items-center justify-between gap-8 py-3">
      <div className="flex items-center gap-3">
        <Avatar src={user.image} isBordered className="h-[35px] w-[35px]" />
        <div>
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold">{user.name}</p>
            {role === "CREATOR" && (
              <p className="rounded-lg bg-warning/20 px-2 py-1 text-[.7rem] font-semibold text-warning">
                Creator
              </p>
            )}
            {role === "MODERATOR" && (
              <p className="rounded-lg bg-secondary/20 px-2 py-1 text-[.7rem] font-semibold text-secondary">
                Moderator
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-[.7rem] font-bold text-navTextColor">
              Member since{" "}
              <span className="text-xs font-normal text-navTextColor">
                {formatDate(createdAt)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {role === "MEMBER" && (
          <Button
            color="secondary"
            size="sm"
            variant="ghost"
            className="hover:text-white"
            radius="lg"
          >
            Assign Mod
          </Button>
        )}
        {role !== "CREATOR" && (
          <Button
            onClick={() => removeMemberMutation({ guildId, memberId: id })}
            color="danger"
            variant="ghost"
            size="sm"
            radius="lg"
            isLoading={isRemovingMember}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
