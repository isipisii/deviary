/* eslint-disable @next/next/no-img-element */
import formatDate from "@/utils/formatDate";
import React from "react";
import { TbArrowBigUpFilled } from "react-icons/tb";
import Link from "next/link";
import { formatTitleWithId } from "@/utils/fornatTitleWithId";


export default function UpvoteNotificationCard({
  notification,
}: {
  notification: TNotification;
}) {
  const { sender, post, createdAt } = notification;
  const href = `/@${post.author.name.split(" ").join(".")}/${
    post.blog
      ? formatTitleWithId(post.blog?.title, post.id)
      : formatTitleWithId(post.diary?.title as string, post.id)
  }`;

  return (
    <Link href={href}>
      <div className="flex gap-3 py-3">
        <div className="relative h-[45px] w-[45px] rounded-full">
          <img src={sender.image} alt="try" className="w-full rounded-full" />
          <p className="absolute bottom-0 right-0 text-[1.1rem] text-[#34FF00]">
            <TbArrowBigUpFilled />
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <p className="text-sm">
            <span className="font-semibold">{sender.name}</span>{" "}
            <span className="text-navTextColor">
              upvoted your {post.type === "BLOG_POST" ? "blog" : "diary"} post
            </span>
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-borderColor p-3">
            {post.type === "BLOG_POST" && (
              <img
                src={post.blog?.thumbnail?.imageUrl}
                alt="try"
                className="h-[50px] w-[90px] rounded-md object-cover"
              />
            )}
            {/* post title */}
            <p className="text-sm">
              {post.type === "BLOG_POST" ? post.blog?.title : post.diary?.title}
            </p>
          </div>
          <p className="self-end text-xs text-navTextColor">
            {formatDate(createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
