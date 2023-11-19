import ThemeToggler from "@/components/ui/theme-toggler"
import { getServerSideSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSideSession()
  
  if(!session) redirect("/sign-in")

  return (
   <main> 
      <ThemeToggler /> 
   </main>
  )
}
