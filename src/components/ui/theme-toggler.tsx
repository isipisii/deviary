"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";

export default function ThemeToggler() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  return (
    <div>
      <Switch
        isSelected={theme === "dark"}
        onValueChange={() => setTheme(theme === "dark" ? "light ": "dark")}
        thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <IoSunny className={className} />
        ) : (
          <FaMoon className={className} />
        )
      }
      />
    </div>
  )
};