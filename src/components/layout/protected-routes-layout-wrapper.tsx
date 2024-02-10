"use client";

import { ReactNode } from "react";
import { useSideBarNavStore } from "@/lib/store/useSideBarNavStore";

export default function ProtectedRoutesLayoutWrapper({ children }: { children: ReactNode }) {
  const { isSideBarMinimized } = useSideBarNavStore((state) => state);

  return (
    <main
      className={`${
        isSideBarMinimized ? "md:ml-[90px]" : "md:ml-[290px]"
      } mt-[75px] transition-all duration-1000 ease-in-out pb-[5rem] md:pb-0`}
    >
      {children}
    </main>
  );
}
