/* eslint-disable @next/next/no-img-element */
"use client";

import { sideBarNavs } from "@/lib/constants";
import Link from "next/link";
import { useEffect, useState } from "react";

import { LuChevronDown, LuChevronLeft } from "react-icons/lu";
import type { IconType } from "react-icons";
import { useSideBarNavStore } from "@/lib/store/useSideBarNavStore";
import { Avatar, Button, CircularProgress, useDisclosure } from "@nextui-org/react";
import { cn } from "@/utils/cn";
import CustomTooltip from "../ui/custom-tooltip";
import { useIsActive } from "@/lib/hooks/useIsActive";
import SettingsModal from "../ui/settings-modal";
import { useGetMyGuilds } from "@/lib/services/guild.api";

export function SideBar() {
  const { isSideBarMinimized, minimizeSideBar, maximizeSideBar } =
    useSideBarNavStore((state) => state);

  function handleToggleMinimize() {
    if (isSideBarMinimized) {
      maximizeSideBar();
    } else minimizeSideBar();
  }

  return (
    <aside
      className={`group fixed z-[5] hidden h-screen flex-none border-r-1 border-borderColor
      shadow-lg transition-all duration-1000 ease-in-out md:block ${
        isSideBarMinimized ? "w-[90px]" : "w-[290px]"
      }`}
    >
      <div className="absolute -right-5 top-[5.5rem] z-20 hidden group-hover:block">
        <CustomTooltip content={isSideBarMinimized ? "Maximize" : "Minimize"}>
          <Button
            className="h-[40px] w-[40px] min-w-0  rounded-full border-2 
             border-borderColor bg-white p-0 text-[1.3rem] text-black"
            onClick={handleToggleMinimize}
          >
            <LuChevronLeft
              className={`${
                isSideBarMinimized ? "-rotate-180" : "-rotate-0"
              } transition-all 
              delay-150 duration-1000 ease-in-out`}
            />
          </Button>
        </CustomTooltip>
      </div>

      <div className="h-full w-full overflow-y-auto bg-background pt-[90px]">
        <div className="my-4 flex flex-col gap-8 p-4">
          {sideBarNavs.map((nav, index) => (
            <SideBarNav key={index} title={nav.title} items={nav.items} />
          ))}
        </div>
      </div>
    </aside>
  );
}

export interface ISideBarNav {
  title: string;
  items: ISideBarNavItem[];
}

export function SideBarNav({ title, items }: ISideBarNav) {
  const { isSideBarMinimized } = useSideBarNavStore((state) => state);
  const { data: guilds, error, isLoading } = useGetMyGuilds();
  const isOverflowing = Array.isArray(guilds) ? guilds?.length > 2 : false;
  const [seeMore, setSeeMore] = useState(false);

  return (
    <div className="relative flex flex-col gap-2">
      {!isSideBarMinimized && <p className="font-semibold">{title}</p>}
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <SideBarNavItem
            key={index}
            href={item.href}
            icon={item.icon}
            imageUrl={item.imageUrl}
            title={item.title}
          />
        ))}

        {isLoading
          ? title === "Guild" && (
              <div className="mt-4 flex w-full items-center justify-center">
                <CircularProgress color="secondary" aria-label="Loading..." />
              </div>
            )
          : title === "Guild" &&
            guilds &&
            guilds
              .slice(0, seeMore ? guilds.length : 2)
              .map((guild, index) => (
                <SideBarNavItem
                  key={index}
                  href={`/guilds/${guild.guild.id}`}
                  imageUrl={guild.guild.image.imageUrl}
                  title={guild.guild.name}
                />
              ))}
      </div>

      {/*button and gradient only for guild side bar navs */}
      {title === "Guild" && isOverflowing && (
        <div
          className={cn(
            `absolute -bottom-4 left-0 flex h-12 
          w-full items-center justify-center bg-gradient-to-t 
          from-background via-background to-transparent`,
            { "-bottom-7": seeMore },
          )}
        >
          <CustomTooltip content={seeMore ? "See less" : "See more"}>
            <Button
              className="h-[35px] w-[35px] min-w-0 rounded-full border-2 
              border-borderColor bg-white p-0 text-[1.2rem] text-black"
              onClick={() => setSeeMore((prevState) => !prevState)}
            >
              <LuChevronDown
                className={`${
                  seeMore ? "-rotate-180" : "-rotate-0"
                } transition-all delay-150 duration-1000 ease-in-out`}
              />
            </Button>
          </CustomTooltip>
        </div>
      )}
    </div>
  );
}

export interface ISideBarNavItem {
  title: string;
  href: string;
  icon?: IconType;
  type?: string;
  imageUrl?: string;
}

export function SideBarNavItem({
  title,
  href,
  icon: Icon,
  type,
  imageUrl,
}: ISideBarNavItem) {
  const isActive = useIsActive();
  const { isSideBarMinimized } = useSideBarNavStore((state) => state);
  const { onOpen, onOpenChange, isOpen } = useDisclosure();

  if (title === "Settings") {
    return (
      <>
        <SettingsModal isOpen={isOpen} onOpenChange={onOpenChange} />
        <button
          onClick={onOpen}
          className={`flex items-center  
          gap-4 rounded-[1.2rem] bg-light p-2 text-[.9rem] font-[500] transition-all duration-1000 ease-in-out 
          hover:bg-lightHover ${
            isActive(href)
              ? "bg-lightHover font-[600] text-activeNavTextColor"
              : "text-navTextColor"
          }`}
        >
          {Icon &&  (
            <p className="rounded-2xl bg-background p-2 text-[1.5rem] text-secondary">
              <Icon />
            </p>
          )}
          {isSideBarMinimized ? null : title}
        </button>
      </>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center  
      gap-4 rounded-[1.2rem] bg-light p-2 text-[.9rem] font-[500] transition-all duration-1000 ease-in-out 
      hover:bg-lightHover ${
        isActive(href)
          ? "bg-lightHover font-[600] text-activeNavTextColor"
          : "text-navTextColor"
      }`}
    >
      {Icon && !imageUrl ? (
        <p
          className={cn(
            "rounded-2xl bg-background p-2 text-[1.5rem] text-secondary",
            { "text-red-700": title === "Popular" },
          )}
        >
          <Icon />
        </p>
      ) : (
        <div className="rounded-2xl bg-background p-2">
          <Avatar
            src={imageUrl}
            isBordered
            className="h-[25px] w-[25px] rounded-full object-cover"
            alt="guild logo"
          />
        </div>
      )}
      {isSideBarMinimized ? null : title}
    </Link>
  );
}
