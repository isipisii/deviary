"use client";

import { signIn, signOut, getProviders, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import AccountDropdown from "./ui/account-dropdown";
import Image from "next/image";

export default function TopNav() {
  const { theme } = useTheme();
  const { data, status } = useSession();
  async function logIn() {
    await signIn("google");
  }

  console.log(theme);
  return (
    <nav className="border border-borderColor">
      <div className="flex p-4 justify-between">
        {/* logo */}
        {/*theres a bug in ternary thats why i conditionally rendered it */}
        {theme === "light" ? (
          <img
            src="/images/deviary-light.svg"
            alt="logo"
          />
        ) : (
          <img
            src="/images/deviary-dark.svg"
            alt="logo"
          />
        )}

        <div>
          {status === "unauthenticated" && (
            <button onClick={logIn}>Sign in with google</button>
          )}
          <AccountDropdown />
        </div>
      </div>
    </nav>
  );
}
