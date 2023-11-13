import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers/providers'
import TopNav from '@/components/top-nav'
import { SideBar } from '@/components/sidebar-nav'

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
            <div className="flex h-screen flex-row md:overflow-hidden">
              <div className="flex-none w-[280px] border-r border-borderColor hidden md:block overflow-y-auto">
                <SideBar />
              </div>
              <div className="flex-grow p-6 md:overflow-y-auto md:p-8">{children}</div>
            </div>
          </Providers>
      </body>
    </html>
  )
}
