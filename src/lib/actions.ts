"use server";
import { revalidatePath } from "next/cache";
import { db } from "./prisma";

export const updateRoute = async (path: string) => {
  revalidatePath(path);
};

export async function getPostById(postId: string, authenticatedUserId: string) {

  const post = await db.post.findUnique({
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
  }) as TPost;

  const bookmark = await db.bookmark.findFirst({
    where: {
      userId: authenticatedUserId,
      postId: postId
    },
    select: {
      id: true
    }
  })

  const isBookmarked = authenticatedUserId ? await db.bookmark.count({
    where: {
      postId: post.id,
      userId: authenticatedUserId
    }
  }) > 0 : false

  return  {
    ...post,
    isBookmarked,
    bookmarkId: bookmark?.id ?? undefined
  }
}
