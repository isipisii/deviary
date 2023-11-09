import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],

    callbacks: {
        async jwt ({ user, token }) {   
            const existingUser = await prisma.user.findFirst({
              where: {
                email: user?.email as string
              }
            })   
            
            // if the user is existing, pass the existing profile and id from db
            if (existingUser) {     
                token.picture = existingUser.image?.image_url as string
                token.id = existingUser.id
            }    

            return token
        },

        async session({ session, token }) {
            if (session.user) {
              //pass the attached user credentials of token in session
              session.user.id = token.id as string
              session.user.name = token.name;
              session.user.email = token.email;
              session.user.image =  token.picture;
            }

            return session;
        },
        async signIn ({ user }){
          try {
            // checks if the user is already in db
            const existingUser = await prisma.user.findFirst({
              where: {
                email: user?.email as string
              }
            }) 

            if(!existingUser) {
              //creates a new user if it is not stored yet
              await prisma.user.create({
                data: {
                  email: user?.email as string,
                  name: user?.name,
                  image: {
                    image_url: user.image as string
                  } 
                }
              })
            }

            return true
            
          } catch (error) {
            NextResponse.json({
              messsage: "Internal Server Error"
            },{status: 500})

            return false
          }
        
        }
    }
}

const authHandler = NextAuth(authOptions)

export { authHandler as GET, authHandler as POST }