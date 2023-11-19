/* eslint-disable @next/next/no-img-element */
"use client"

import { signIn } from "next-auth/react"
import { Button } from "@nextui-org/react"
import { useRouter } from "next/navigation"

export default function GoogleButton() {
    const router = useRouter()

    async function handleGoogleSignIn() {
        try {
            const res = await signIn("google")
            if(res?.ok) {
                router.replace
            }
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <Button variant="bordered" size="lg" className="font-semibold flex items-center justify-center"
        onClick={handleGoogleSignIn}
    >
        <img src="/images/google.svg" alt="google-logo" className="h-4 w-4"/>
        Google
    </Button>
  )
}
