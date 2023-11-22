import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import Providers from "@/components/providers/providers";
import TopNav from "@/components/top-nav";
import { SideBar } from "@/components/sidebar-nav";
import { getServerSideSession } from "@/lib/auth";
import { Toaster } from "sonner";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deviary",
  description: `a developer's diary and community`,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSideSession();

  return (
    <html lang="en">
      <body className={inter.className + "bg-background"}>
        <Providers>
          <NextTopLoader height={3} showSpinner={false} color="#DD0DB9"/>
          <Toaster richColors expand={true} position="bottom-right" />
          {session && <TopNav />}
          <div className="flex h-screen flex-row md:overflow-hidden">
            {session && (
              <div className="flex-none w-[280px] border-r border-borderColor hidden md:block overflow-y-auto">
                <SideBar />
              </div>
            )}
            <div className="flex-grow">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
