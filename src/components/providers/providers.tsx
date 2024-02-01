"use client"
import { useState } from "react";
import { ReactNode } from "react"
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NextNProgress from "../ui/nprogress";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchInterval:  60 * 1000,
      }
    }
  }))

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <NextUIProvider>
            <ThemeProvider enableSystem>
              {/* <ProgressBar
                height="3px"
                color="#DD0DB9"
                options={{ showSpinner: false }}
                shallowRouting
              /> */}
              <NextNProgress
                height={3}
                color="#DD0DB9"
              />
              {children} 
            </ThemeProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
