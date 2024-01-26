import type { Metadata } from "next";
import { Noto_Sans, Inter, Roboto } from "next/font/google";
import "./styles/globals.css";
import Providers from "@/components/providers/providers";
import { Toaster } from "sonner";
import "@uploadthing/react/styles.css";

export const metadata: Metadata = {
  title: "Deviary",
  description: `a developer's diary and community`,
};

export default async function RootLayout({ children, }: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"bg-background"}>
        <Providers>
          <Toaster richColors expand={true} position="bottom-right" className="bg-background" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
