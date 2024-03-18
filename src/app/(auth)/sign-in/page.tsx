import SignInForm from "../components/sign-in-form"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deviary | Sign in",
  description: `a developer's diary and community`,
};

export default async function SignIn() {
  return (
    <SignInForm />
  )
}
