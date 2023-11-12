"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  return (
    <div>
      The current theme is: {theme}
      <Button color="secondary" variant="solid" onClick={() => setTheme('light')}>
        Light Mode
      </Button>
      <Button color="secondary" variant="flat" onClick={() => setTheme('dark')}>
        Dark Mode
      </Button>
    </div>
  )
};