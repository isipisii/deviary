import { SideBar } from "@/components/layout/sidebar-nav";
import TopNav from "@/components/layout/top-nav";
import LayoutWrapper from "@/components/layout/layout-wrapper";
import { ReactNode } from "react";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopNav />
      <div className="md:overflow-hidden">     
        <SideBar />
        <MobileBottomNav />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </div>
    </>
  );
}
