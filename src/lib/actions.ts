"use server";
import { revalidatePath } from "next/cache";
import { db } from "./prisma";

export const updateRoute = async (path: string) => {
  revalidatePath(path);
};

export async function getPostById(postId: string) {
  return (await db.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      blog: true,
      diary: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })) as TPost;
}
