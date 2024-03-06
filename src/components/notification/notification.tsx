"use client";

import { FaRegBell, FaBell } from "react-icons/fa";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { useGetNotifications } from "@/lib/services/notifications.api";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher/client";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { newNotificationOptimisticUpdate } from "@/lib/services/notifications.api";
import NotificationList from "./notification-list";
import NotificationSkeleton from "../skeleton-loaders/notification-skeleton";
import { FaRegEye } from "react-icons/fa6";
import { useViewAllNotifications } from "@/lib/services/notifications.api";

export default function Notification() {
  const { data: sessionData } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: viewAllNotificationsMutation } = useViewAllNotifications();
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
          await newNotificationOptimisticUpdate(queryClient, newNotification);
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

  function hasUnviewedNotification(notifications: TNotification[]) {
    return notifications?.some((notification) => !notification.viewed);
  }

  return (
    <Popover
      placement="bottom-end"
      classNames={{
        content: ["bg-background p-0", "rounded-xl border border-borderColor"],
      }}
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>
        <Button
          variant="bordered"
          isIconOnly
          className="relative rounded-xl border-1 border-borderColor text-[1.3rem]"
        >
          {notifications && hasUnviewedNotification(notifications) && (
            <span className="absolute right-2 top-[.4rem] h-[10px] w-[10px] rounded-full bg-red-500"></span>
          )}
          {isOpen ? <FaBell /> : <FaRegBell />}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex w-[400px] flex-col gap-5 py-5 sm:w-[500px] md:w-[600px]">
          <h3 className="px-5 text-xl font-semibold">Notifications</h3>
          {/* // skeleton loader of notifs */}
          {isLoading && (
            <div className="flex w-full flex-col gap-4 px-4">
              {[...new Array(3)].map((_, index) => (
                <NotificationSkeleton key={index} />
              ))}
            </div>
          )}

          {/* notifications */}
          {notifications && notifications?.length > 0 && (
            <NotificationList
              notifications={notifications}
              setAsViewed={setAsViewed}
            />
          )}

          {/* will render if notif is empty */}
          {notifications?.length === 0 && (
            <div className="flex h-[490px] w-full items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <p className="text-[4rem] text-navTextColor">
                  <FaRegBell />
                </p>
                <div className="space-y-2">
                  <h3 className="text-center text-lg font-semibold text-navTextColor md:text-xl">
                    No notifications.
                  </h3>
                  <p className="text-center text-xs font-medium text-navTextColor/80 md:text-sm">
                    Don&apos;t worry, we&apos;ll let you know.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex w-full items-end justify-end px-4">
            {notifications && notifications?.length > 0 && (
              <Button
                color="secondary"
                variant="light"
                size="sm"
                className="rounded-lg"
                startContent={<FaRegEye />}
                isDisabled={!hasUnviewedNotification(notifications)}
                onClick={() => viewAllNotificationsMutation()}
              >
                Mark all as viewed
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
