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
      _count: {
        select: {
          upvotes: {
            where: { userId: authenticatedUserId },
          },
          bookmarks: {
            where: { userId: authenticatedUserId },
          },
        },
      },
    },
  });

  if (post) {
    const { _count, ...rest } = post;

    return {
      ...rest,
      isUpvoted: _count?.upvotes > 0,
      isBookmarked: _count.bookmarks > 0,
    } as TPost;
  }
}
