import type { Metadata } from "next";
import { Noto_Sans, Inter, Roboto } from "next/font/google";
import "./styles/globals.css";
import Providers from "@/components/providers/providers";
import { Toaster } from "sonner";
import "@uploadthing/react/styles.css";

// const inter = Noto_Sans({ weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });
// const inter = Inter({ weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"] });
// const inter = Roboto({ weight: ["100", "300", "400", "500", "700", "900"], style: ["normal"], subsets: ["cyrillic"] });

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
