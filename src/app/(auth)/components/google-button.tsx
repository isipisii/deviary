/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@nextui-org/react"
import { useRouter } from 'next-nprogress-bar';

export default function GoogleButton() {
    const router = useRouter()
    const [isSigningIn, setIsSigningIn] = useState(false)

    async function handleGoogleSignIn() {
        try {
            setIsSigningIn(true)

            await signIn("google")

            setIsSigningIn(false)
            router.push('/feed');
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <Button 
        variant="bordered"
        size="md"
        className="font-semibold flex items-center justify-center"
        isLoading={isSigningIn}
        onClick={handleGoogleSignIn}
    >
        <img src="/images/google.svg" alt="google-logo" className="h-4 w-4"/>
        Google
    </Button>
  )
}
