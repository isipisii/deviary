import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession } from "next-auth";
import argon2 from "argon2"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
          const { email, password } = credentials as TSignInCredentials

          try {
              const user = await db.user.findFirst({
                where: {
                  email
                },
              })
              if (!user) throw Error("Invalid credentials");

              if(user.password) {
                const didMatch = await argon2.verify(user.password, password)
                if (!didMatch) throw Error("Invalid credentials");
              }

              // the will be the user in jwt's callback params
              return {
                  name: user.name,
                  email: user.email,
                  id: user.id,
                  picture: user.image
              }
          } catch (error) {
              console.log(error);
              return null;
          }
        },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      const existingUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!existingUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        picture: existingUser.image,
      }
    },

    async session({ session, token }) {
      if (session.user) {
        //pass the attached user credentials of token in session
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};

// for getting server session without putting authOptions in every declaration
export const getServerSideSession = () => getServerSession(authOptions)