import { SideBar } from "@/components/sidebar-nav";
import TopNav from "@/components/top-nav";
import { getServerSideSession } from "@/lib/auth";
import clsx from "clsx";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerSideSession();
  return (
    <>
      <TopNav />
      <div className="md:overflow-hidden">
        <div
          className="flex-none w-[280px] border-r border-borderColor hidden 
                md:block overflow-y-auto shadow-lg mt-[60px] fixed h-screen"
        >
          <SideBar />
        </div>
        <main className={clsx({ "mt-[60px] md:ml-[300px]": session })}>
          {children}
        </main>
      </div>
    </>
  );
}
