/* eslint-disable @next/next/no-img-element */
"use client";

import AccountDropdown from "../ui/account-dropdown";
import { FiBell } from "react-icons/fi";
import { Button } from "@nextui-org/react";
import ThemeToggler from "../ui/theme-toggler";
import { useSession } from "next-auth/react";
import Logo from "../ui/logo";
import AccountSkeleton from "../shared/skeleton-loaders/account-skeleton";
import CustomTooltip from "../ui/custom-tooltip";
import MobileSidebar from "./mobile-sidebar";

export default function TopNav() {
  const { data } = useSession();

  return (
    <nav className="fixed top-0 z-[10] w-full border-b border-borderColor bg-background shadow-sm">
      <div className="flex w-full items-center justify-between px-6 py-4">
        {/* logo */}
        <div className="flex items-center gap-3">
          <MobileSidebar />
          <Logo />
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggler />
          <CustomTooltip content="Notifications">
            <Button
              variant="bordered"
              isIconOnly
              className="rounded-xl border-1 border-borderColor text-[1.3rem]"
            >
              <FiBell />
            </Button>
          </CustomTooltip>

          {data ? <AccountDropdown /> : <AccountSkeleton />}
        </div>
      </div>
    </nav>
  );
}
