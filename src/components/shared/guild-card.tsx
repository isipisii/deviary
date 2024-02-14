/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link";
import { Button } from "@nextui-org/react";

export default function GuildCard({ guild }: { guild: TGuild }) {
    return (
      <Link href={`/guilds/${guild.id}`} className="w-full max-w-[350px]">
        <div className="relative flex h-[400px] w-full max-w-[350px] items-end justify-center overflow-hidden rounded-3xl border-2 border-borderColor bg-cardBg p-4 shadow-xl">
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
    
          <div className="z-[5] flex h-full w-full flex-col justify-between gap-4">
            <div className="flex w-full flex-col  gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={guild.image.imageUrl}
                  alt=""
                  className="h-[90px] w-[90px] rounded-full bg-background object-cover p-1"
                />
                <div>
                  <h2 className="text-xl font-bold">{guild.name}</h2>
                  <p className="text-sm">
                    @{guild.name.toLowerCase().replaceAll(" ", "")}
                  </p>
                </div>
              </div>
              <p className="text-[.875rem] text-navTextColor md:text-[1rem]">
                {guild.description}
              </p>
            </div>
            <Button
              className="rounded-xl font-semibold hover:text-white"
              color="secondary"
              variant="ghost"
            >
              {guild.isPrivate ? "Request to join" : "Join Guild"}
            </Button>
          </div>
        </div>
      </Link>
    );
  }
  