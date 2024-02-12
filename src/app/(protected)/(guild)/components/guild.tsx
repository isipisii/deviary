/* eslint-disable @next/next/no-img-element */
"use client";

import { Avatar, AvatarGroup, Button } from "@nextui-org/react";
import GuildContextMenu from "./guild-context-menu";

export default function Guild({ guild }: { guild: TGuild }) {
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
          src={guild.image.imageUrl}
          alt="guild-avatar"
          className=" h-[120px] w-[120px] rounded-full  bg-foreground object-cover p-1 shadow-sm md:h-[150px] md:w-[150px]"
        />

        <div className="guild-lower">
          <div className="grid place-items-center gap-4 lg:place-items-start">
            <div className="guild-details flex flex-col gap-4">
              <div>
                <h2 className="text-[2rem] font-bold">{guild.name}</h2>
                <p>@{guild.name.toLowerCase().replaceAll(" ", "")}</p>
              </div>
              <p className="text-navTextColor">{guild.description}</p>
            </div>

            {/* TODO: MAKE THIS DYNAMIC */}
            <AvatarGroup
              max={5}
              total={10}
              size="sm"
              className="w-[210px]"
              renderCount={(count) => (
                <p className="ms-2 text-sm font-medium text-foreground">
                  +{count} others
                </p>
              )}
            >
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
            </AvatarGroup>
          </div>
          
          <div className="flex gap-2 items-center">
            <Button 
              size="md"
              color="secondary"
              className="w-full max-w-[250px] rounded-xl font-medium text-white"
            >
              Request to join
            </Button>
            <GuildContextMenu />
          </div>
         
        </div>
      </div>
    </div>
  );
}
