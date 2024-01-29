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
    <Link href={formatPostHref(post)} className="w-full" 
    >            
      <div className="relative flex gap-3 py-3 w-full">
        {!notification.viewed && (
          <div className="absolute right-0 top-0 h-[10px] w-[10px] rounded-full bg-secondary" />
        )}

        <div className="relative md:h-[40px] md:w-[40px] h-[35px] w-[35px]">
         <Avatar src={sender.image} className="md:h-[40px] md:w-[40px] h-[35px] w-[35px]" />
          
          <p className="absolute bottom-0 right-0 text-[1.1rem] text-[#34FF00]">
            <TbArrowBigUpFilled />
          </p>
        </div>

        <div className="flex flex-col gap-3 w-[95%]">
          <div className="flex items-center justify-between">
            <p className="text-xs md:text-sm">
              <Link href={`/profile/${sender.id}`} className="font-semibold">
                {sender.name}
              </Link>{" "}
              <span className="text-navTextColor">
                upvoted your {post.type === "BLOG_POST" ? "blog" : "diary"} post
              </span>
            </p>
            <NotificationContextMenu notification={notification} />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-borderColor p-3">
            {post.type === "BLOG_POST" && (
              <img
                src={post.blog?.thumbnail?.imageUrl}
                alt="try"
                className="h-[40px] w-[80px]  md:h-[50px] md:w-[90px] rounded-md object-cover"
              />
            )}
            {/* post title */}
            <p className="text-xs md:text-sm">
              {post.type === "BLOG_POST" ? post.blog?.title : post.diary?.title}
            </p>
          </div>
          <p className="self-end md:text-xs text-[.7rem] text-navTextColor">
            {formatDate(createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
