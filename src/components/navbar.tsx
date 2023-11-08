/* eslint-disable @next/next/no-img-element */
"use client"

import { useSession } from "next-auth/react"
import { signIn, signOut } from "next-auth/react"

export default function Navbar() {

    const { data, status } = useSession()

    async function logIn(){
        await signIn("google")
    }

    console.log(data)

    return ( 
        <nav>
            {
            data ? 
                <button onClick={async() => {
                    await signOut()
                }}>
                    Sign out
                </button>
            :  
                <button onClick={logIn}>Sign in with google</button> 
            }
            {status === "authenticated" && <h1>{data?.user?.email}</h1>}
            {data?.user?.image && <img src={data.user.image} alt="profile" />}
        </nav>
    )
}
