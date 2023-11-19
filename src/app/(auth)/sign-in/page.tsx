import SignInForm from "../components/sign-in-form"
import { getServerSideSession } from "@/lib/auth"
import { redirect } from "next/navigation"


export default async function SignIn() {
  const session = await getServerSideSession()

  if(session){
    redirect("/")
  }

  return (
    <SignInForm />
  )
}
