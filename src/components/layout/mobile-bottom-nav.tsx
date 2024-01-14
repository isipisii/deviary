"use client";

import Link from "next/link";
import { mobileBottomNavItems } from "@/lib/constants";
import type { IconType } from "react-icons";
import { useIsActive } from "@/lib/hooks/useIsActive";
import { cn } from "@/utils/cn";

export default function MobileBottomNav() {
  const isActive = useIsActive();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 
      z-[8] w-full bg-background
      border-borderColor border-t md:hidden"
    >
      <div className="flex w-full flex-row justify-between px-8 py-4">
        {mobileBottomNavItems.map((navItem, index) => {
          const Icon = navItem.icon as IconType;
          
          return (
            <Link href={navItem.href} key={index + navItem.href}>
              <p
                className={cn(
                  `flex w-full items-center justify-center p-2 text-[1.5rem] text-navTextColor opacity-70 
                  transition-all duration-1000 ease-in-out hover:text-activeNavTextColor hover:opacity-100`,
                  {
                    "text-activeNavTextColor opacity-90": isActive(
                      navItem.href,
                    ),
                  },
                  { "border-b-3 border-secondary": isActive(navItem.href) },
                )}
              >
                <Icon />
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

{
  /* <div className="flex w-full flex-row justify-between">
{mobileBottomNavItems.map((navItem, index) => {
  const Icon = navItem.icon as IconType;
  return (
    <Link
      href={navItem.href}
      key={index + navItem.href}
      className={cn("w-full p-4", {
        "border-t-3 border-secondary": isActive(navItem.href),
      })}
    >
      <p
        className={cn(
          `flex w-full items-center justify-center p-2 text-[1.5rem] text-navTextColor opacity-70 
          transition-all duration-1000 ease-in-out hover:text-activeNavTextColor hover:opacity-100`,
          {
            "text-activeNavTextColor opacity-90": isActive(
              navItem.href,
            ),
          },
          //   { "border-b-3 border-secondary": isActive(navItem.href) },
        )}
      >
        <Icon />
      </p>
    </Link>
  );
})}
</div> */
}
