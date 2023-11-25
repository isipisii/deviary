import { getServerSideSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"
import OnBoardingForm from "./compoonents/onboarding-form"

export default async function OnBoarding() {
  const session = await getServerSideSession()

  const user = {
    name: session?.user.name as string,
    email: session?.user.email as string,
    image: session?.user.image as string
  }

  return (
   <main className="h-screen w-full flex items-center justify-center"> 
      <OnBoardingForm user={user} />
   </main>
  )
}
