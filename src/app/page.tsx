import { getServerSideSession } from "@/lib/auth"
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher"

export default async function Home() {
  const session = await getServerSideSession()
  console.log(session)

  return (
   <main> 
      <ThemeSwitcher /> 
   </main>
  )
}
