/* eslint-disable @next/next/no-img-element */
import { Avatar, AvatarGroup, Button, Skeleton } from "@nextui-org/react";
import GuildContextMenu from "./guild-context-menu";
import { AiOutlineUserAdd } from "react-icons/ai";

export default function GuildDetails({ guild }: { guild: TGuild }) {
  return (
    <div className="z-[5] grid h-auto w-full place-items-center gap-4 border-b border-borderColor bg-background/30 p-6 backdrop-blur-xl md:p-12 lg:place-items-start ">
      <img
        src={guild?.image.imageUrl}
        alt="guild-avatar"
        className="h-[120px] w-[120px] rounded-full  bg-foreground object-cover p-1 shadow-sm md:h-[150px] md:w-[150px]"
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
            className="w-full max-w-[2.5rem] rounded-xl font-medium text-white"
            isIconOnly
            startContent={<AiOutlineUserAdd className="text-[1.2rem]" />}
          />
          <GuildContextMenu />
        </div>
      </div>
    </div>
  );
}
