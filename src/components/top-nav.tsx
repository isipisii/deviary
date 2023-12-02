/* eslint-disable @next/next/no-img-element */
"use client";

import { useTheme } from "next-themes";
import AccountDropdown from "./ui/account-dropdown";
import { FiBell } from "react-icons/fi";
import {
  Button,
  Tooltip,
} from "@nextui-org/react";
import ThemeToggler from "./ui/theme-toggler";
import { Skeleton } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function TopNav() {
  const { theme } = useTheme();
  const { data } = useSession();

  return (
    <nav className="border-b border-borderColor shadow-sm fixed w-full bg-background z-[20] top-0">
      <div className="flex p-4 justify-between items-center w-full">
        {/* logo */}
        <img
          src={
            theme === "light"
              ? "/images/deviary-light.svg"
              : "/images/deviary-dark.svg"
          }
          alt="logo"
        />
        <div className="flex gap-4 items-center">
          <ThemeToggler />
          <Tooltip content="Notifications" className="bg-background">
            <Button
              variant="bordered"
              isIconOnly
              className="border-borderColor border-1 rounded-xl text-[1.3rem]"
            >
              <FiBell />
            </Button>
          </Tooltip>

          {data ? (
            <AccountDropdown />
          ) : (
            <div className="w-[200px] flex items-center gap-3">
              <div>
                <Skeleton className="flex rounded-full w-10 h-10" />
              </div>
              <div className="w-full flex flex-col gap-1">
                <Skeleton className="h-3 w-full rounded-lg" />
                <Skeleton className="h-3 w-[60%] rounded-lg" />
              </div>
            </div>
          )}
        </div>
      </div>
    {/* </Navbar> */}
    </nav>
  );
}
