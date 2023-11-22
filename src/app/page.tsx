import ThemeToggler from "@/components/ui/theme-toggler"
import { getServerSideSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"

export default async function Home() {
  const session = await getServerSideSession()

  const user = await db.user.findFirst({
    where: {
      id: session?.user.id
    }
  })

  if(user) {
    if(!user.onboarded) {
      redirect("/onboarding")
    }
  }
  
  return (
   <main> 
      
   </main>
  )
}
