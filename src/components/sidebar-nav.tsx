/* eslint-disable @next/next/no-img-element */
"use client";

import { sideBarNavs } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";
import dynamic from "next/dynamic";
import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import clsx from "clsx";

import { Button, Tooltip, ScrollShadow } from "@nextui-org/react";

export function SideBar() {
  return (
    <ScrollShadow size={50} className="max-h-[90vh]">
      <div className="flex flex-col gap-8 my-4 p-4">
        {sideBarNavs.map((nav, index) => (
          <SideBarNavs key={index} title={nav.title} items={nav.items} />
        ))}
      </div>
    </ScrollShadow>
  );
}

export interface ISideBarNavs {
  title: string;
  items: ISideBarNavItems[];
}

export function SideBarNavs({ title, items }: ISideBarNavs) {
  const isOverflowing = items.filter((item) => item.type === "guild").length > 2;
  const [seeMore, setSeeMore] = useState(false)
  
  return (
    <div className="flex flex-col gap-2 relative">
      <p className="font-semibold">{title}</p>
      <div className="flex flex-col gap-2">
        {items.slice(0, seeMore ? items.length : 4).map((item, index) => (
          <SideBarNavItems
            key={index}
            href={item.href}
            icon={item.icon as keyof typeof dynamicIconImports}
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
              {seeMore ? <ChevronUp className="text-sm"/> : <ChevronDown className="text-sm"/>}
            </Button>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

interface ISideBarNavItems {
  title: string;
  href: string;
  icon?: keyof typeof dynamicIconImports;
  type?: "guild";
  imageUrl?: string;
}

export function SideBarNavItems({
  title,
  href,
  icon,
  type,
  imageUrl,
}: ISideBarNavItems) {
  return (
    <Link
      href={href}
      className="bg-[#1d262e4e] flex items-center gap-4 p-2 rounded-[1.2rem]"
    >
      {icon && !imageUrl ? (
        <p
          className={clsx(
            "text-[#DD0DB9] bg-background text-[2rem] p-2 rounded-2xl",
            { "text-red-600": title === "Popular" }
          )}
        >
          <Icon name={icon} />
        </p>
      ) : (
        <div className="bg-background p-2 rounded-2xl">
          <img
            src={imageUrl}
            className="rounded-full h-[25px] w-[25px]"
            alt="guild logo"
          />
        </div>
      )}
      {title}
    </Link>
  );
}

// for dynamic icons
interface IconProps extends LucideProps {
  name: keyof typeof dynamicIconImports;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = dynamic(dynamicIconImports[name]);

  return <LucideIcon {...props} />;
};

export default Icon;
