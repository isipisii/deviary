import { SideBar } from "@/components/layout/sidebar-nav";
import TopNav from "@/components/layout/top-nav";
import ProtectedRoutesLayoutWrapper from "@/components/layout/protected-routes-layout-wrapper";
import { ReactNode } from "react";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";

export default async function ProtectedRoutesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopNav />
      <div className="md:overflow-hidden">     
        <SideBar />
        <MobileBottomNav />
        <ProtectedRoutesLayoutWrapper>
          {children}
        </ProtectedRoutesLayoutWrapper>
      </div>
    </>
  );
}
