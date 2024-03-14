import { ScrollShadow } from "@nextui-org/react";
import UpvoteNotificationCard from "./upvote-notification-card";
import CommentNotificationCard from "./comment-notification-card";
import JoinRequesNotificationCard from "./join-request-notification-card";
import NotificationCard from "./notification-card";

export default function NotificationList({
  notifications,
}: {
  notifications: TNotification[];
}) {
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

              if (notification.type === "ASSIGN_MOD") {
                return (
                  <NotificationCard
                    notification={notification}
                    key={notification.id}
                    message="assigned you as mod in"
                  />
                );
              }

              if (notification.type === "JOIN_REQUEST_ACCEPTED") {
                return (
                  <NotificationCard
                    notification={notification}
                    key={notification.id}
                    message="accepted your join request in"
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
