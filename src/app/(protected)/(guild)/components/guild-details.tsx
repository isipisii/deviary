/* eslint-disable @next/next/no-img-element */
import { Avatar, Button } from "@nextui-org/react";
import GuildContextMenu from "./guild-context-menu";
import { AiOutlineUserAdd } from "react-icons/ai";
import CustomAvatarGroup from "@/components/ui/custom-avatar-group";
import { useJoinGuild, useJoinRequestGuild, useRemoveJoinRequest } from "@/lib/services/guild.api";

export default function GuildDetails({ guild }: { guild: TGuild }) {
  const { mutate: joinGuildMutation, isPending: joiningGuild } = useJoinGuild()
  const { mutate: joinRequestGuildMutation, isPending: sendingJoiningRequest } = useJoinRequestGuild()
  const { mutate: removeJoinRequestMutation, isPending: removingJoiningRequest } = useRemoveJoinRequest()
  const isPending = joiningGuild || sendingJoiningRequest || removingJoiningRequest

  function handleJoinGuild() {
    if(!guild.isPrivate) {
      joinGuildMutation(guild.id)
      return
    }

    if(guild.hasAnExistingJoinRequest) {
      removeJoinRequestMutation(guild.id)
      return
    }
    
    joinRequestGuildMutation(guild.id)
  }

  return (
    <div className="z-[5] grid h-auto w-full place-items-center gap-4 border-b border-borderColor bg-background/30 p-6 backdrop-blur-xl md:p-12 lg:place-items-start">
      <Avatar
        src={guild?.image.imageUrl}
        alt="guild-avatar"
        isBordered
        className="rounded-full= h-[120px] w-[120px] object-cover shadow-sm md:h-[150px] md:w-[150px]"
      />

      <div className="guild-lower">
        <div className="grid place-items-center gap-4 lg:place-items-start">
          <div className="guild-details flex flex-col gap-4">
            <div>
              <h2 className="text-[2rem] font-bold">{guild?.name}</h2>
              <p>@{guild?.name.toLowerCase().replaceAll(" ", "")}</p>
            </div>
            <p className="text-[.875rem] text-navTextColor md:text-[1rem]">
              {guild?.description}
            </p>
          </div>

          <CustomAvatarGroup
            guildName={guild.name}
            members={guild.members}
            totalMembersCount={guild.membersCount}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="md"
            color="secondary"
            variant={
              guild.isBelong || guild.hasAnExistingJoinRequest
                ? "bordered"
                : "solid"
            }
            className={`w-full rounded-xl font-medium ${
              ((guild.isBelong || guild.hasAnExistingJoinRequest) &&
                "text-secondary") ||
              "text-white"
            }`}
            onClick={handleJoinGuild}
            isLoading={isPending}
            isDisabled={guild.isBelong}
          >
            {(guild.hasAnExistingJoinRequest && "Cancel Request") ||
              (guild.isBelong && "Joined") ||
              (guild.isPrivate && "Request to join") ||
              "Join Guild"}
          </Button>

          <Button
            size="md"
            color="secondary"
            variant="bordered"
            className="w-full max-w-[2.5rem] rounded-xl font-medium "
            isIconOnly
            startContent={<AiOutlineUserAdd className="text-[1.2rem]" />}
          />
          <GuildContextMenu guild={guild} />
        </div>
      </div>
    </div>
  );
}
