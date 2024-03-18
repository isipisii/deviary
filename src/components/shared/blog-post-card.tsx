/* eslint-disable @next/next/no-img-element */

import { Avatar } from "@nextui-org/react";
import PostActions from "./post-actions";
import PostContextMenu from "../ui/post-context-menu";
import Link from "next/link";
import formatDate from "@/utils/formatDate";
import formatPostHref from "@/utils/formatPostHref";
import estimateReadingTime from "@/utils/estimateReadingTime";
import { Image } from "@nextui-org/react";
import PostReadingHistoryContextMenu from "../ui/post-reading-history-context-menu";

interface IBlogPostCard {
  post: TPost;
  readingHistoryId?: string;
}

export default function BlogPostCard({
  post,
  readingHistoryId,
}: IBlogPostCard) {
  const { thumbnail, content, title } = post?.blog as TBlog;
  const { name, image } = post.author as TUser;

  return (
    <Link href={formatPostHref(post)} className="w-full max-w-[350px]">
      <div className="h-[400px] w-full max-w-[350px] rounded-3xl border-2 border-borderColor shadow-lg">
        <div className="relative h-full w-full">
          {/* image and bg gradient */}
          <Image
            isBlurred
            src={thumbnail?.imageUrl}
            alt="thumbnail"
            removeWrapper
            className="absolute left-0 top-0 z-[5] h-full w-full rounded-3xl object-cover"
          />
          <div
            className="absolute bottom-0 left-0 z-[6] h-full w-full rounded-b-3xl bg-gradient-to-t from-[#0C1319]
         via-[#0c1319c8] to-[#24253300]"
          />

          {/* blog details */}
          <div className="absolute bottom-4 left-1/2 z-[6] flex w-[90%] -translate-x-1/2 flex-col justify-center gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <Link href={`/profile/${post.authorId}`}>
                  <Avatar
                    src={image as string}
                    className="w-[40px h-[40px]"
                    isBordered
                  />
                </Link>
                {readingHistoryId ? (
                  <PostReadingHistoryContextMenu
                    readingHistoryId={readingHistoryId}
                  />
                ) : (
                  <PostContextMenu
                    className="bg-background"
                    postType="BLOG_POST"
                    post={post}
                  />
                )}
              </div>
              <h3 className="mt-1 line-clamp-2 w-full text-xl font-bold text-white shadow-lg">
                {title}
              </h3>
            </div>
            <div>
              <p className="text-[.8rem] text-[#A1A1AA]">
                {formatDate(post.createdAt)} • {estimateReadingTime(content)}
              </p>
            </div>
            {/* blog actions */}
            <PostActions post={post} />
          </div>
        </div>
      </div>
    </Link>
  );
}
