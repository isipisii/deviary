"use client"

import { ReactNode } from "react"
import { useSideBarNavStore } from "@/lib/store/useSideBarNavStore"

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const { isSideBarMinimized } = useSideBarNavStore(state => state)
  
  return (
    <main className={`${isSideBarMinimized ? "ml-[120px]": "ml-[300px]"} transition-all ease-in-out duration-300 mt-[60px]`} >
        {children}
    </main>
  )
}