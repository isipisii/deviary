import { getServerSideSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"

export default async function OnBoarding() {
  const session = await getServerSideSession()

  const user = await db.user.findFirst({
    where: {
      id: session?.user.id
    }
  })

  if(user) {
    if(user.onboarded) {
      redirect("/")
    }
  }
  
  return (
   <main> 
      OnBoarding
   </main>
  )
}
