/* eslint-disable @next/next/no-img-element */
"use client";

import { sideBarNavs } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LuChevronDown, LuChevronUp, LuChevronLeft } from "react-icons/lu";
import clsx from "clsx";
import type { IconType } from "react-icons";
import { useSideBarNavStore } from "@/lib/store/useSideBarNavStore";

import { Button, Tooltip, Spinner } from "@nextui-org/react";

export function SideBar() {
  const { isSideBarMinimized, minimizeSideBar, maximizeSideBar } = useSideBarNavStore(state => state)

  function handleToggleMinimize() {
    if(isSideBarMinimized) {
      maximizeSideBar()
    } else minimizeSideBar()
  }

  return (
    <div
      className={`flex-none  border-r border-borderColor hidden transition-all ease-in-out duration-1000
      md:block shadow-lg pt-[90px] fixed h-screen ${isSideBarMinimized ? "w-[90px]" : "w-[290px]"}`}
    > 
      <div className="absolute -right-5  top-[5.5rem] z-20">
        <Tooltip  
          content={isSideBarMinimized ? "Maximize" : "Minimize"}
          className="bg-background z-40"
        >
          <Button
            className="min-w-0 w-[40px] h-[40px] p-0 rounded-full 
              bg-white border-2 border-borderColor text-[1.3rem] text-black"
            onClick={handleToggleMinimize}
          >
            <LuChevronLeft 
              className={`${isSideBarMinimized ? "-rotate-180" : "-rotate-0"} transition-all 
              ease-in-out duration-1000 delay-150`} 
            />
          </Button>
        </Tooltip>
      </div>
      
      <div className="w-full h-full overflow-y-auto">
        <div className="flex flex-col gap-8 my-4 p-4">
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
  const { isSideBarMinimized } = useSideBarNavStore(state => state)
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
    <div className="flex flex-col gap-2 relative">
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
              <div className="w-full flex items-center justify-center mt-4">
                <Spinner color="secondary" labelColor="primary" />
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
          className={clsx(
            `w-full left-0 absolute h-12 bg-gradient-to-t 
          from-background via-background to-transparent flex 
          items-center justify-center -bottom-4`,
            { "-bottom-7": seeMore }
          )}
        >
          <Tooltip
            content={seeMore ? "See less" : "See more"}
            className="bg-background"
          >
            <Button
              className="min-w-0 w-[35px] h-[35px] p-0 rounded-full 
              bg-white border-2 border-borderColor text-[1.2rem] text-black"
              onClick={() => setSeeMore((prevState) => !prevState)}
            >
              <LuChevronDown className={`${seeMore ? "-rotate-180" : "-rotate-0"} transition-all ease-in-out duration-1000 delay-150`}  />
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
  const { isSideBarMinimized } = useSideBarNavStore(state => state)

  // navItemBackground: "#c7c7c72c",
  // navItemHoverBg: "#c7c7c75e"
  return (
    <Link
      href={href}
      className={clsx(
        "bg-navItemBackground hover:bg-navItemHoverBg  flex items-center gap-4 p-2 rounded-[1.2rem] transition-all ease-in-out duration-1000",
        { "bg-navItemHoverBg font-semibold": isActive(href) }
      )}
    >
      {Icon && !imageUrl ? (
        <p
          className={clsx(
            "text-secondary bg-background text-[1.5rem] p-2 rounded-2xl",
            {"text-red-600": title === "Popular"}
          )}
        >
          <Icon />
        </p>
      ) : (
        <div className="bg-background p-2 rounded-2xl">
          <img
            src={imageUrl}
            className="rounded-full h-[23px] w-[23px]"
            alt="guild logo"
          />
        </div>
      )}
      {isSideBarMinimized ? null : title}
    </Link>
  );
}
