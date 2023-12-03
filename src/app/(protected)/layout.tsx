import { SideBar } from "@/components/sidebar-nav";
import TopNav from "@/components/top-nav";
import { getServerSideSession } from "@/lib/auth";
import LayoutWrapper from "@/components/layout-wrapper";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerSideSession();
  return (
    <>
      <TopNav />
      <div className="md:overflow-hidden">     
        <SideBar />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </div>
    </>
  );
}
