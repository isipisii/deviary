"use client";

import AccountDropdown from "../ui/account-dropdown";
import { useSession } from "next-auth/react";
import Logo from "../ui/logo";
import AccountSkeleton from "../shared/skeleton-loaders/account-skeleton";
import Notification from "../notification/notification";
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
          <Notification/>
          {data ? <AccountDropdown /> : <AccountSkeleton />}
        </div>
      </div>
    </nav>
  );
}
