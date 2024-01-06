/* eslint-disable @next/next/no-img-element */
"use client";

import AccountDropdown from "../ui/account-dropdown";
import { FiBell } from "react-icons/fi";
import { Button, Tooltip } from "@nextui-org/react";
import ThemeToggler from "../ui/theme-toggler";
import { Skeleton } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Logo from "../ui/logo";

export default function TopNav() {
  const { data } = useSession();

  return (
    <nav className="fixed top-0 z-[10] w-full border-b border-borderColor bg-background shadow-sm">
      <div className="flex w-full items-center justify-between px-6 py-4">
        {/* logo */}
        <Logo />
        <div className="flex items-center gap-4">
          <ThemeToggler />
          <Tooltip content="Notifications" className="bg-background">
            <Button
              variant="bordered"
              isIconOnly
              className="rounded-xl border-1 border-borderColor text-[1.3rem]"
            >
              <FiBell />
            </Button>
          </Tooltip>

          {data ? (
            <AccountDropdown />
          ) : (
            <div className="flex w-[200px] items-center gap-3">
              <div>
                <Skeleton className="flex h-10 w-10 rounded-full" />
              </div>
              <div className="flex w-full flex-col gap-1">
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
