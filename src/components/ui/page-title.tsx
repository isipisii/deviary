import { ReactNode } from "react"

export default function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-semibold text-3xl">
        {children}
    </h2>
  )
}
