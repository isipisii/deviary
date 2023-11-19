/* eslint-disable @next/next/no-img-element */
"use client";

import { sideBarNavs } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";

import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import clsx from "clsx";
import type { IconType } from "react-icons"

import { Button, Tooltip, ScrollShadow } from "@nextui-org/react";

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
  const isOverflowing = items.filter((item) => item.type === "guild").length > 2;
  const [seeMore, setSeeMore] = useState(false)
  
  return (
    <div className="flex flex-col gap-2 relative">
      <p className="font-semibold">{title}</p>
      <div className="flex flex-col gap-2">
        {items.slice(0, seeMore ? items.length : 4).map((item, index) => (
          <SideBarNavItem
            key={index}
            href={item.href}
            icon={item.icon}
            imageUrl={item.imageUrl}
            title={item.title}
          />
        ))}
      </div>
      
      {/* for guild side bar navs */}
      {title === "Guild" && isOverflowing && (
        <div
            className="w-full -bottom-4  left-0 absolute
            h-12 bg-gradient-to-t from-[#00060C]
          via-[#00060cb2] to-transparent flex items-center justify-center"
        >
          <Tooltip content={seeMore ? "See less" : "See more"}>
            <Button     
              className="min-w-0 w-[40px] h-[40px] p-0 rounded-full 
              bg-background border border-borderColor"
              onClick={() => setSeeMore(prevState => !prevState)}
            >
              {seeMore ? <LuChevronUp className="text-sm"/> : <LuChevronDown className="text-sm"/>}
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
  icon?: IconType
  type?: "guild";
  imageUrl?: string;
}

export function SideBarNavItem({
  title,
  href,
  icon: Icon,
  type,
  imageUrl,
}: ISideBarNavItem) {
  return (
    <Link
      href={href}
      className="bg-[#1d262e4e] flex items-center gap-4 p-2 rounded-[1.2rem]"
    >
      {Icon && !imageUrl ? (
        <p
          className={clsx(
            "text-[#DD0DB9] bg-background text-[1.5rem] p-2 rounded-2xl",
            { "text-red-600": title === "Popular" }
          )}
        >
          <Icon/>
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
