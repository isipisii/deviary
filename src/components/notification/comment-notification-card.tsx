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
          <div className="absolute -bottom-2 -right-2 bg-background p-1 rounded-full">
            <p className="text-[1rem] text-[#4283f4] ">
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

          {/* comment */}
          <div className="flex items-center gap-2 rounded-lg bg-light p-3">
            {/* comment content */}
            <p className="truncate text-[.8rem] md:text-[.93rem] font-medium">
              {comment?.content}
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
