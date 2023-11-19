/* eslint-disable @next/next/no-img-element */
"use client"

import { Input, Divider, Button } from "@nextui-org/react"
import GoogleButton from "./google-button";

export default function SignInForm() {
  return (
    <form className="max-w-[600px] w-full flex flex-col gap-4">
      <h2 className="font-semibold text-xl">Sign in to your account</h2>
      <div className="flex flex-col gap-2">
        <Input 
          isClearable
          type="email"
          label="Email"
          labelPlacement="outside"
          placeholder="Enter your email"
          size="lg"
          variant="bordered"
        />
        <Input
          isClearable
          type="password"
          label="Password"
          labelPlacement="outside"
          placeholder="Enter your password"
          size="lg"
          variant="bordered"
        />
        <Button color="secondary" size="lg" variant="solid" className="font-semibold">Sign in</Button>
      </div>
      <div className="flex gap-4 w-full items-center">
        <Divider className="w-[35%]"/>
        <p className="w-full text-center opacity-60 text-sm">Or continue with</p>  
        <Divider className="w-[35%]"/>
      </div>
      
      <GoogleButton />
    </form>
  )
}
