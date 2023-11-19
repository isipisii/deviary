/* eslint-disable @next/next/no-img-element */
"use client";

import { signIn, signOut, getProviders, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import AccountDropdown from "./ui/account-dropdown";

export default function TopNav() {
  const { theme } = useTheme();
  const { data, status } = useSession();
  
  async function logIn() {
    await signIn("google");
  }

  return (
    <nav className="border border-borderColor">
      <div className="flex p-4 justify-between">
        {/* logo */}
        {/*theres a bug in ternary thats why i conditionally rendered it */}
        <img
          src={theme === "light" ? "/images/deviary-light.svg" :  "/images/deviary-dark.svg" }
          alt="logo"
        />
        <AccountDropdown />
      </div>
    </nav>
  );
}
