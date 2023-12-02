import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import Providers from "@/components/providers/providers";
import TopNav from "@/components/top-nav";
import { SideBar } from "@/components/sidebar-nav";
import { getServerSideSession } from "@/lib/auth";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import "@uploadthing/react/styles.css";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deviary",
  description: `a developer's diary and community`,
};

export default async function RootLayout({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname: string;
}) {
  const session = await getServerSideSession();
  // console.log(pathname)

  // // for checking if the user isnt onboarded
  // const user = await db.user.findFirst({
  //   where: {
  //     id: session?.user.id
  //   }
  // })

  return (
    <html lang="en">
      <body className={inter.className + "bg-background"}>
        <Providers>
          <Toaster richColors expand={true} position="bottom-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
