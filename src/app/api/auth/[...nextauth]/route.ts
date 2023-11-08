import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const authOptions: NextAuthOptions = {
    // adapter: PrismaAdapter(prisma),
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
            if (user) {     
                token.picture = user.image?.toString()
                token.id = user.email?.toString()
            }

            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
              session.user.id = token.id as string
              session.user.name = token.name;
              session.user.email = token.email;
              session.user.image =  token.picture;
            }

            return session;
        },
    }
}

const authHandler = NextAuth(authOptions)

export { authHandler as GET, authHandler as POST }


