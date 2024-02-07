/* eslint-disable @next/next/no-img-element */
import formatDate from "@/utils/formatDate";
import React from "react";
import { FaComment } from "react-icons/fa6";
import Link from "next/link";
import NotificationContextMenu from "../ui/notification-context-menu";
import formatPostHref from "@/utils/formatPostHref";
import { Avatar } from "@nextui-org/react";

export default function CommentNotificationCard({
  notification,
}: {
  notification: TNotification;
}) {
  const { sender, comment, createdAt } = notification;

  return (
    <Link href={formatPostHref(comment?.post as TPost)} className="w-full">
      <div className="relative flex w-full gap-3 rounded-lg py-4">
        {!notification.viewed && (
          <div className="absolute right-0 top-0 h-[10px] w-[10px] rounded-full bg-secondary" />
        )}

        {/* sender's avatar */}
        <div className="relative h-[35px] w-[35px] md:h-[40px] md:w-[40px]">
          <Avatar
            src={sender.image}
            className="h-[35px] w-[35px] md:h-[40px] md:w-[40px]"
          />

          <div className="absolute -bottom-2 -right-2 bg-background p-1 rounded-full">
            <p className="text-[1.1rem] text-[#4283f4] ">
              <FaComment />
            </p>
          </div>
        </div>

        <div className="flex w-[90%] flex-col gap-3">
          {/* sender */}
          <div className="flex items-center justify-between">
            <p className="text-[.8rem] md:text-[.93rem]">
              <Link href={`/profile/${sender.id}`} className="font-semibold">
                {sender.name}
              </Link>{" "}
              <span className="text-navTextColor">
                commented to your{" "}
                {comment?.post?.type === "BLOG_POST" ? "blog" : "diary"} post.
              </span>
            </p>
            <NotificationContextMenu notification={notification} />
          </div>

          {/* post */}
          <div className="flex items-center gap-2 rounded-lg bg-light p-3">
            {comment?.post?.type === "BLOG_POST" && (
              <img
                src={comment?.post?.blog?.thumbnail?.imageUrl}
                alt="try"
                className="h-[40px] w-[80px] rounded-md object-cover md:h-[50px] md:w-[90px]"
              />
            )}
            {/* post title */}
            <p className="truncate text-[.75rem] md:text-[.8rem]">
              {comment?.post?.type === "BLOG_POST"
                ? comment.post.blog?.title
                : comment?.post?.diary?.title}
            </p>
          </div>

          {/* date */}
          <p className="self-end text-[.7rem] text-navTextColor md:text-xs">
            {formatDate(createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
