"use client"

import { ReactNode } from "react";
import { MobileSidebarNavItem } from "@/components/layout/mobile-sidebar";
import { settingsSideNavItems } from "@/lib/constants";
import PageTitle from "@/components/ui/page-title";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="mx-8 flex gap-8 w-full max-w-[900px] pt-8 ">
        <aside className="flex flex-col gap-8 px-4 w-[250px] ">
          <PageTitle>Settings</PageTitle>
          <div className="flex flex-col gap-2">
            {
              settingsSideNavItems.map((navItem, index) => (
                <MobileSidebarNavItem href={navItem.href} icon={navItem.icon} title={navItem.title} key={index}/>
              ))
            }
          </div>
        </aside>
        {/*TODO: sidebar */}
        {children}
      </div>
    </div>
  );
}
