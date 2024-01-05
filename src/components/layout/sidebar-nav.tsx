/* eslint-disable @next/next/no-img-element */
"use client";

import { sideBarNavs } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LuChevronDown, LuChevronLeft } from "react-icons/lu";
import type { IconType } from "react-icons";
import { useSideBarNavStore } from "@/lib/store/useSideBarNavStore";
import { Button, Tooltip, CircularProgress } from "@nextui-org/react";
import { cn } from "@/utils/cn";

export function SideBar() {
  const { isSideBarMinimized, minimizeSideBar, maximizeSideBar } =
    useSideBarNavStore((state) => state);

  function handleToggleMinimize() {
    if (isSideBarMinimized) {
      maximizeSideBar();
    } else minimizeSideBar();
  }

  return (
    <div
      className={`fixed z-10 hidden h-screen flex-none border-r-1 border-borderColor bg-background
      pt-[90px] shadow-lg transition-all duration-1000 ease-in-out md:block ${
        isSideBarMinimized ? "w-[90px]" : "w-[290px]"
      }`}
    >
      <div className="absolute -right-5  top-[5.5rem] z-20">
        <Tooltip
          content={isSideBarMinimized ? "Maximize" : "Minimize"}
          className="z-40 bg-background"
        >
          <Button
            className="h-[40px] w-[40px] min-w-0 rounded-full border-2 
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
        </Tooltip>
      </div>

      <div className="h-full w-full  overflow-y-auto">
        <div className="my-4 flex flex-col gap-8 p-4">
          {sideBarNavs.map((nav, index) => (
            <SideBarNav key={index} title={nav.title} items={nav.items} />
          ))}
        </div>
      </div>
    </div>
  );
}

export interface ISideBarNavs {
  title: string;
  items: ISideBarNavItem[];
}

export function SideBarNav({ title, items }: ISideBarNavs) {
  const { isSideBarMinimized } = useSideBarNavStore((state) => state);
  const [guilds, setGuilds] = useState<ISideBarNavItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isOverflowing = guilds.length > 2;
  const [seeMore, setSeeMore] = useState(false);

  const guildsArr = [
    {
      title: "ReactJS",
      href: "/guild",
      type: "guild",
      imageUrl: "https://avatars.githubusercontent.com/u/6412038?s=200&v=4",
    },
    {
      title: "Libre Minds",
      href: "/guild",
      type: "guild",
      imageUrl: "https://avatars.githubusercontent.com/u/148235334?s=200&v=4",
    },
    {
      title: "Libre Minds",
      href: "/guild",
      type: "guild",
      imageUrl: "https://avatars.githubusercontent.com/u/148235334?s=200&v=4",
    },
    {
      title: "ReactJS",
      href: "/guild",
      type: "guild",
      imageUrl: "https://avatars.githubusercontent.com/u/6412038?s=200&v=4",
    },
  ];

  // REMINDER: use useQuery for fetching if theres already an actual api endppint for this
  useEffect(() => {
    // mock up api call since i dont have yet an api for guilds
    async function getGuilds() {
      setIsLoading(true);
      const guilds = (await new Promise((resolve) => {
        setTimeout(() => {
          resolve(guildsArr);
        }, 4000);
      })) as ISideBarNavItem[];

      setGuilds(guilds);
      setIsLoading(false);
    }

    getGuilds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            guilds
              .slice(0, seeMore ? guilds.length : 2)
              .map((guild, index) => (
                <SideBarNavItem
                  key={index}
                  href={guild.href}
                  imageUrl={guild.imageUrl}
                  title={guild.title}
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
          <Tooltip
            content={seeMore ? "See less" : "See more"}
            className="bg-background"
          >
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
          </Tooltip>
        </div>
      )}
    </div>
  );
}

interface ISideBarNavItem {
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
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const { isSideBarMinimized } = useSideBarNavStore((state) => state);

  return (
    <Link
      href={href}
      // className={clsx(
      //   "bg-light hover:bg-lightHover  flex items-center gap-4 p-2 rounded-[1.2rem] transition-all ease-in-out duration-1000 font-[500] text-navTextColor",
      //   { "bg-lightHover font-[600] text-activeNavTextColor": isActive(href) }
      // )}
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
          <img
            src={imageUrl}
            className="h-[23px] w-[23px] rounded-full"
            alt="guild logo"
          />
        </div>
      )}
      {isSideBarMinimized ? null : title}
    </Link>
  );
}
