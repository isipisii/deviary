import { ReactNode } from "react"

export default function CardContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-12 items-center justify-center flex-wrap mt-8 w-full">
        {children}
    </div>
  )
}
