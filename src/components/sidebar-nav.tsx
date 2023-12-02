/* eslint-disable @next/next/no-img-element */
"use client";

import { sideBarNavs } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import clsx from "clsx";
import type { IconType } from "react-icons";

import { Button, Tooltip, ScrollShadow, Spinner } from "@nextui-org/react";

export function SideBar() {
  return (
    <ScrollShadow size={50} className="max-h-[90vh]">
      <div className="flex flex-col gap-8 my-4 p-4">
        {sideBarNavs.map((nav, index) => (
          <SideBarNav key={index} title={nav.title} items={nav.items} />
        ))}
      </div>
    </ScrollShadow>
  );
}

export interface ISideBarNavs {
  title: string;
  items: ISideBarNavItem[];
}

export function SideBarNav({ title, items }: ISideBarNavs) {
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

  useEffect(() => {
    // mock up api call since i dont have a be for guilds
    async function getGuilds() {
      setIsLoading(true);
      const guilds = (await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(guildsArr);
        }, 4000);
      })) as ISideBarNavItem[];

      setGuilds(guilds);
      setIsLoading(false);
    }

    getGuilds();
  }, []);

  return (
    <div className="flex flex-col gap-2 relative">
      <p className="font-semibold">{title}</p>
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
                <Spinner color="primary" labelColor="primary" />
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

      {/* for guild side bar navs */}
      {title === "Guild" && isOverflowing && (
        <div
          className={`w-full ${
            seeMore ? "-bottom-7" : "-bottom-4"
          } left-0 absolute
            h-12 bg-gradient-to-t from-background
            via-background to-transparent flex items-center justify-center`}
        >
          <Tooltip
            content={seeMore ? "See less" : "See more"}
            className="bg-background"
          >
            <Button
              className="min-w-0 w-[40px] h-[40px] p-0 rounded-full 
              bg-background border-2 border-borderColor text-[1.2rem]"
              onClick={() => setSeeMore((prevState) => !prevState)}
            >
              {seeMore ? <LuChevronUp /> : <LuChevronDown />}
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

  return (
    <Link
      href={href}
      className={clsx(
        "bg-navItemBackground hover:bg-navItemHoverBg font-medium flex items-center gap-4 p-2 rounded-[1.2rem]",
        { "bg-navItemHoverBg font-semibold": isActive(href) }
      )}
    >
      {Icon && !imageUrl ? (
        <p
          className={clsx(
            "text-[#DD0DB9] bg-background text-[1.5rem] p-2 rounded-2xl",
            { "text-red-600": title === "Popular" }
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
      {title}
    </Link>
  );
}
