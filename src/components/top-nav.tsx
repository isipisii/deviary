/* eslint-disable @next/next/no-img-element */
"use client";

import { useTheme } from "next-themes";
import AccountDropdown from "./ui/account-dropdown";
import { FiBell } from "react-icons/fi";
import { Button, Tooltip } from "@nextui-org/react";
import ThemeToggler from "./ui/theme-toggler";

export default function TopNav() {
  const { theme } = useTheme();

  return (
    <nav className="border border-borderColor">
      <div className="flex p-4 justify-between items-center">
        {/* logo */}
        <img
          src={theme === "light" ? "/images/deviary-light.svg" :  "/images/deviary-dark.svg" }
          alt="logo"
        />

        <div className="flex gap-4 items-center">
            <ThemeToggler />
            <Tooltip content="Notifications" className="bg-backgorund">
              <Button 
                variant="bordered" 
                isIconOnly 
                className="border-borderColor border-1 rounded-xl text-[1.3rem]" 
              >
                <FiBell />
              </Button>
            </Tooltip>
            <AccountDropdown />
        </div>
      </div>
    </nav>
  );
}
