"use client"

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Logo() {
  const { theme } = useTheme();
  const isDarkMode =
    typeof window === "undefined"
      ? null
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isSystemDark, setIsSystemDark] = useState(isDarkMode);

  useEffect(() => {
    setIsSystemDark(isDarkMode);
  }, [theme, isDarkMode]);

  return (
    <>
      {typeof window !== "undefined" && (
        <Image
          src={
            theme === "system"
              ? isSystemDark
                ? "/images/deviary-dark.png"
                : "/images/deviary-light.png"
              : theme === "dark" || theme === undefined
                ? "/images/deviary-dark.png"
                : "/images/deviary-light.png"
          }
          alt="logo"
          width={90}
          height={30}
        />
      )}
    </>
  );
}
