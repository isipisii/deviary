"use client"

import { ReactNode } from "react"
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from '@nextui-org/react'


export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
        <NextUIProvider>
            <ThemeProvider>
                {children} 
            </ThemeProvider>
        </NextUIProvider>
    </SessionProvider>
  )
}
