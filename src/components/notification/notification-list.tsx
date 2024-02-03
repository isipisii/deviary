"use client";

import { useEffect } from "react";
import { ScrollShadow } from "@nextui-org/react";
import UpvoteNotificationCard from "./upvote-notification-card";

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
    <ScrollShadow size={80} className="h-[500px] w-full px-4">
      <div className="flex w-full flex-col gap-4">
        {notifications && (
          <div className="flex w-full flex-col gap-4">
            {notifications.map((notification, index) => (
              <UpvoteNotificationCard key={index} notification={notification} />
            ))}
          </div>
        )}
      </div>
    </ScrollShadow>
  );
}
