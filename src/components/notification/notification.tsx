"use client";

import { FiBell } from "react-icons/fi";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Skeleton,
} from "@nextui-org/react";
import { useGetNotifications } from "@/lib/services/notifications.api";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher/client";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/constants";
import NotificationList from "./notification-list";
import NotificationSkeleton from "../skeleton-loaders/notification-skeleton";

export default function Notification() {
  const { data: sessionData } = useSession();
  //TODO: CREATE A TOAST LIKE NOTIFICATION
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const { data: notifications, isLoading } = useGetNotifications();
  const queryClient = useQueryClient();

  useEffect(() => {
    // listen to the authenticated user's channel
    const channel = pusherClient
      .subscribe(`channel_user_${sessionData?.user.id}`)
      .bind(
        "new-notification",
        async (data: { notification: TNotification }) => {
          const newNotification = data.notification;
          //append the upcoming notification to the cached notifications
          queryClient.setQueryData<TNotification[]>(
            [QueryKeys.Notifications],
            (oldData) => {
              const newData = oldData ? [newNotification, ...oldData] : oldData;
              return newData;
            },
          );
          await queryClient.invalidateQueries({
            queryKey: [QueryKeys.Notifications],
          });
          setHasNewNotification(true);
        },
      );

    return () => {
      channel.unbind();
    };
  }, [sessionData?.user.id, queryClient]);

  function setAsViewed() {
    setHasNewNotification(false);
  }

  return (
    <Popover
      placement="bottom-end"
      classNames={{
        content: ["bg-background", "rounded-xl border border-borderColor"],
      }}
    >
      <PopoverTrigger>
        <Button
          variant="bordered"
          isIconOnly
          className="relative rounded-xl border-1 border-borderColor text-[1.3rem]"
        >
          {notifications?.some((notification) => !notification.viewed) && (
            <span className="absolute right-1 top-1 h-[12px] w-[12px] rounded-full bg-red-500"></span>
          )}
          <FiBell />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex w-[400px] flex-col gap-4 p-4 sm:w-[500px] md:w-[600px]">
          <h3 className="text-xl font-semibold">Notifications</h3>
          {isLoading ? (
            <div className="flex w-full flex-col gap-4">
              {[...new Array(3)].map((_, index) => (
                <NotificationSkeleton key={index} />
              ))}
            </div>
          ) : (
            notifications && (
              <NotificationList
                notifications={notifications}
                setAsViewed={setAsViewed}
              />
            )
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
