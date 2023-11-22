import { getServerSideSession } from "@/lib/auth"
import SignUpForm from "../components/sign-up-form"
import { redirect } from "next/navigation"

export default async function SignUp() {
  // const session = await getServerSideSession()

  // if(session){
  //   redirect("/")
  // }
  
  return (
    <SignUpForm />
  )
}
