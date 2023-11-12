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
        {theme === 'light' ? (
          <img src="/assets/deviary-light.svg" alt="logo" />
        ) : (
          <img src="/assets/deviary-dark.svg" alt="logo" />  
        )}

        <div>
          {/* TODO: make a context menu for sign out*/}
          {!data && <button onClick={logIn}>Sign in with google</button>}
          <AccountDropdown />
        </div>
      </div>
    </nav>
  );
}
  