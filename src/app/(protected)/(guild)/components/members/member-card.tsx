"use client";

import formatDate from "@/utils/formatDate";
import { Avatar, Button } from "@nextui-org/react";
import {
  useAssignModerator,
  useRemoveGuildMember,
  useUnassignModerator,
} from "@/lib/services/guild.api";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/constants";
import { useSession } from "next-auth/react";

export default function MemberCard({
  guildMember,
}: {
  guildMember: TGuildMember;
}) {
  const { data: sessionData } = useSession();
  const queryClient = useQueryClient();
  const { user, id: memberId, createdAt, role, guildId } = guildMember;
  const currentGuild = queryClient.getQueryData<TGuild>([
    QueryKeys.Guild,
    guildId,
  ]);
  const { mutate: removeMemberMutation, isPending: isRemovingMember } =
    useRemoveGuildMember();
  const { mutate: assignModeratorMutation, isPending: isAssigning } =
    useAssignModerator();
  const { mutate: unassignModeratorMutation, isPending: isUnassigning } =
    useUnassignModerator();

  function handleAssignModerator() {
    if (role === "MEMBER") assignModeratorMutation({ guildId, memberId });
    if (role === "MODERATOR") unassignModeratorMutation({ guildId, memberId });
  }

  return (
    <div className="flex w-full items-center justify-between gap-8 py-3">
      <div className="flex items-center gap-3">
        <Avatar src={user.image} isBordered className="h-[35px] w-[35px]" />
        <div>
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold">
              {sessionData?.user.id === user.id ? "You" : user.name}
            </p>
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

      {/* will only show if this member is not equal to the authenticated user 
      and if the authenticated user is either creator or moderator of the guild */}
      {sessionData?.user.id !== user.id &&
        (currentGuild?.isModerator || currentGuild?.isGuildCreator) && (
          <div className="flex gap-2">
            {currentGuild?.isGuildCreator && (
              <Button
                color="secondary"
                size="sm"
                variant="ghost"
                className="hover:text-white"
                radius="lg"
                isLoading={isAssigning || isUnassigning}
                onClick={handleAssignModerator}
              >
                {role === "MODERATOR" ? "Remove Mod" : "Assign Mod"}
              </Button>
            )}
            { role !== "CREATOR" && (currentGuild?.isModerator || currentGuild?.isGuildCreator) && (
                <Button
                  onClick={() => removeMemberMutation({ guildId, memberId })}
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
        )}
    </div>
  );
}
