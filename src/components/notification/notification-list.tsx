"use client";

import { useEffect } from "react";
import { ScrollShadow } from "@nextui-org/react";
import UpvoteNotificationCard from "./upvote-notification-card";
import CommentNotificationCard from "./comment-notification-card";
import JoinRequesNotificationCard from "./join-request-notification-card";

export default function NotificationList({
  notifications,
  setAsViewed,
}: {
  notifications: TNotification[];
  setAsViewed: () => void;
}) {
  useEffect(() => {
    setAsViewed();
  }, [setAsViewed]);

  return (
    <ScrollShadow size={80} className="h-[500px] w-full">
      <div className="flex w-full flex-col gap-4">
        {notifications && (
          <div className="flex w-full flex-col">
            {notifications.map((notification) => {
              if (notification.type === "UPVOTE") {
                return (
                  <UpvoteNotificationCard
                    key={notification.id}
                    notification={notification}
                  />
                );
              }

              if (notification.type === "COMMENT") {
                return (
                  <CommentNotificationCard
                    notification={notification}
                    key={notification.id}
                  />
                );
              }

              if (notification.type === "JOIN_REQUEST") {
                return (
                  <JoinRequesNotificationCard
                    notification={notification}
                    key={notification.id}
                  />
                );
              }
            })}
          </div>
        )}
      </div>
    </ScrollShadow>
  );
}
