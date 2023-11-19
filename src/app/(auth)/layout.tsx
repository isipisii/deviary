import { ReactNode } from "react"

export default function AuthLayout({ children}: { children: ReactNode }) {
  return (
   <main className="flex justify-center items-center h-screen w-full">
      {children}
   </main>
  )     
}
