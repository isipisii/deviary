"use client"
import { useState } from "react";
import { ReactNode } from "react"
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <NextUIProvider>
            <ThemeProvider>
              <ProgressBar
                height="3px"
                color="#DD0DB9"
                options={{ showSpinner: false }}
                shallowRouting
              />
              {children} 
            </ThemeProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
