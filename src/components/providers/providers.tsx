"use client";
import { useState } from "react";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ShareModal from "../ui/share-modal";
import EditSharedPostModal from "@/app/(protected)/(guild)/components/edit-shared-post-modal";
import GuildMembersModal from "@/app/(protected)/(guild)/components/members/guild-members-modal";
import GuildJoinRequestsModal from "@/app/(protected)/(guild)/components/join-requests/guild-join-requests-modal";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchInterval: 60 * 1000,
          },
        },
      }),
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ShareModal />
        <EditSharedPostModal />
        <GuildMembersModal />
        <GuildJoinRequestsModal />
        <NextUIProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
