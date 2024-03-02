"use client";

import AccountDropdown from "../ui/account-dropdown";
import { useSession } from "next-auth/react";
import Logo from "../ui/logo";
import AccountSkeleton from "../skeleton-loaders/account-skeleton";
import Notification from "../notification/notification";
import MobileSidebar from "./mobile-sidebar";

export default function TopNav() {
  const session = useSession();

  return (
    <nav className="fixed top-0 z-[10] w-full border-b border-borderColor bg-background shadow-sm">
      <div className="flex w-full items-center justify-between px-6 py-4">
        {/* logo */}
        <div className="flex items-center gap-3">
          <MobileSidebar />
          <Logo />
        </div>

        <div className="flex items-center gap-4">
          {session.status === "authenticated" && <Notification />}
          {session.status === "loading" && (
            <div className="hidden md:flex">
              <AccountSkeleton />
            </div>
          )}
          {session.status === "authenticated" && (
            <div className="hidden md:flex">
              <AccountDropdown />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
