"use client"
import { useState } from "react";
import { ReactNode } from "react"
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <NextUIProvider>
            <ThemeProvider>
              {children} 
            </ThemeProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
