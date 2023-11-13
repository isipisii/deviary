import ThemeToggler from "@/components/ui/theme-toggler"
import { getServerSideSession } from "@/lib/auth"

export default async function Home() {
  const session = await getServerSideSession()
  console.log(session)

  return (
   <main> 
      <ThemeToggler /> 
   </main>
  )
}
