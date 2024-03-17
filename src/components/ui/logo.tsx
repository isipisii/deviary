"use client" 

import { useTheme } from "next-themes";
import Image from "next/image";

export default function Logo() {
  const { resolvedTheme } = useTheme();
  return (
    <>
      {resolvedTheme && (
        <Image
          src={
            resolvedTheme === "dark"
              ? "/images/deviary-dark.png"
              : "/images/deviary-light.png"
          }
          alt="light logo"
          width={90}
          height={30}
        />
      )}
    </>
  );
}
