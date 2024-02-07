/* eslint-disable @next/next/no-img-element */
import formatDate from "@/utils/formatDate";
import React from "react";
import { TbArrowBigUpFilled } from "react-icons/tb";
import Link from "next/link";
import NotificationContextMenu from "../ui/notification-context-menu";
import formatPostHref from "@/utils/formatPostHref";
import { Avatar } from "@nextui-org/react";

export default function UpvoteNotificationCard({
  notification,
}: {
  notification: TNotification;
}) {
  const { sender, post, createdAt } = notification;

  return (
    <Link href={formatPostHref(post as TPost)} className="w-full">
      <div className="relative flex w-full gap-3 py-3">
        {!notification.viewed && (
          <div className="absolute right-0 top-0 h-[10px] w-[10px] rounded-full bg-secondary" />
        )}
        
        {/* sender's avatar */}
        <div className="relative h-[35px] w-[35px] md:h-[40px] md:w-[40px]">
          <Avatar
            src={sender.image}
            className="h-[35px] w-[35px] md:h-[40px] md:w-[40px]"
          />

          <div className="absolute -bottom-2 -right-2 rounded-full bg-background p-1">
            <p className="text-[1.1rem] text-[#34FF00]">
              <TbArrowBigUpFilled />
            </p>
          </div>
        </div>

        <div className="flex w-[95%] flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[.8rem] md:text-[.93rem]">
              <Link href={`/profile/${sender.id}`} className="font-semibold">
                {sender.name}
              </Link>{" "}
              <span className="text-navTextColor">
                upvoted your {post?.type === "BLOG_POST" ? "blog" : "diary"}{" "}
                post
              </span>
            </p>
            <NotificationContextMenu notification={notification} />
          </div>

          {/* post */}
          <div className="flex items-center gap-2 rounded-lg bg-light p-3">
            {post?.type === "BLOG_POST" && (
              <img
                src={post?.blog?.thumbnail?.imageUrl}
                alt="try"
                className="h-[40px] w-[80px] rounded-md object-cover md:h-[50px] md:w-[90px]"
              />
            )}
            {/* post title */}
            <p className="truncate text-[.75rem] md:text-[.8rem]">
              {post?.type === "BLOG_POST"
                ? post.blog?.title
                : post?.diary?.title}
            </p>
          </div>
          <p className="self-end text-[.7rem] text-navTextColor md:text-xs">
            {formatDate(createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
