import NextAuth, { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";

const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST };
