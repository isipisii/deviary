import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
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