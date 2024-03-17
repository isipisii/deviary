import SignUpForm from "../components/sign-up-form"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deviary | Sign up",
  description: `a developer's diary and community`,
};

export default async function SignUp() {  
  return (
    <SignUpForm />
  )
}
