import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers/providers'
import TopNav from '@/components/top-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Deviary',
  description: `a developer's diary and community`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + "bg-background"}>
          <Providers>
            <TopNav />
            {children}
          </Providers>
      </body>
    </html>
  )
}
