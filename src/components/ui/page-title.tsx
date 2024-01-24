import { ReactNode } from "react"

export default function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-semibold text-2xl md:text-3xl">
        {children}
    </h2>
  )
}
