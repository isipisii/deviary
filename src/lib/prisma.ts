import { PrismaClient } from "@prisma/client";
//prisma client is used for reading, manipulating data
declare global {
  var prisma: PrismaClient | undefined;
};

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma
