/* eslint-disable @next/next/no-img-element */
"use client";

import { sideBarNavs } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import clsx from "clsx";
import type { IconType } from "react-icons"

import { Button, Tooltip, ScrollShadow } from "@nextui-org/react";

export function SideBar() {
  return (
    <ScrollShadow 
      size={50} 
      className="max-h-[90vh]"
    >
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
            className={`w-full ${seeMore ? "-bottom-7" : "-bottom-4"} left-0 absolute
            h-12 bg-gradient-to-t from-background
            via-background to-transparent flex items-center justify-center`}
        >
          <Tooltip content={seeMore ? "See less" : "See more"} className="bg-background">
            <Button     
              className="min-w-0 w-[40px] h-[40px] p-0 rounded-full 
              bg-background border-2 border-borderColor text-[1.2rem]"
              onClick={() => setSeeMore(prevState => !prevState)}
            >
              {seeMore ? <LuChevronUp/> : <LuChevronDown />}
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
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  return (
    <Link
      href={href}
      className= {clsx(
        "bg-navItemBackground hover:bg-navItemHoverBg font-medium flex items-center gap-4 p-2 rounded-[1.2rem]",
        {"bg-navItemHoverBg font-semibold": isActive(href)}
      )}
    >
      {Icon && !imageUrl ? (
        <p
          className={clsx( 
            "text-[#DD0DB9] bg-background text-[1.5rem] p-2 rounded-2xl",
            { "text-red-600": title === "Popular", }
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
