"use client"

/* eslint-disable @next/next/no-img-element */
import formatDate from "@/utils/formatDate";
import React, { useEffect, useState } from "react";
import { TbArrowBigUpFilled } from "react-icons/tb";
import Link from "next/link";
import NotificationContextMenu from "../ui/notification-context-menu";
import formatPostHref from "@/utils/formatPostHref";
import { Avatar } from "@nextui-org/react";
import { useViewNotification } from "@/lib/services/notifications.api";

export default function UpvoteNotificationCard({
  notification,
}: {
  notification: TNotification;
}) {
  const { sender, post, createdAt } = notification;
  const { mutate: viewNotificationMutation } = useViewNotification();

  return (
    <Link href={formatPostHref(post as TPost)} className="w-full" onClick={() => viewNotificationMutation(notification.id)}>
       <div className="relative flex w-full gap-4 p-5 hover:bg-[#a8a7a716] transition-all duration-1000 ease-in-out ">
        {!notification.viewed && (
          <div className="absolute left-6 top-1/2 h-[10px] w-[10px] rounded-full bg-secondary" />
        )}
        
        {/* sender's avatar */}
        <div className="relative h-[30px] w-[30px] md:h-[35px] md:w-[35px]">
          <Avatar
            src={sender.image}
            showFallback
            isBordered
            className="h-[30px] w-[30px] md:h-[35px] md:w-[35px]"
          />

          <div className="absolute -bottom-2 -right-2 rounded-full bg-background p-1">
            <p className="text-[1rem] text-[#34FF00]">
              <TbArrowBigUpFilled />
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
            <p className="truncate text-[.75rem] md:text-[.8rem] font-medium">
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
