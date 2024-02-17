"use client";

import formatDate from "@/utils/formatDate";
import NotificationContextMenu from "../ui/notification-context-menu";
import Link from "next/link";
import { Avatar, Button } from "@nextui-org/react";
import {
  useAcceptJoinRequest,
  useDeclineJoinRequest,
} from "@/lib/services/guild.api";

export default function JoinRequesNotificationCard({
  notification,
}: {
  notification: TNotification;
}) {
  const { joinRequest, viewed, id: notificationId, sender } = notification;
  const { mutate: acceptJoinRequestMutation, isPending: isAccepting } =
    useAcceptJoinRequest();
  const { mutate: declineJoinRequestMutation, isPending: isDeclining } =
    useDeclineJoinRequest();

  return (
    <div
      key={notificationId}
      className="relative flex w-full gap-4 p-4 transition-all duration-1000 ease-in-out hover:bg-[#a8a7a716] "
    >
      {!viewed && (
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
          <Avatar
            src={joinRequest.guild.image.imageUrl}
            alt="guild logo"
            className="h-4 w-4 rounded-full"
          />
        </div>
      </div>

      <div className="flex w-[90%] flex-col gap-4">
        {/* sender's name and message */}
        <div className="flex items-center justify-between">
          <p className="text-[.8rem] md:text-[.93rem]">
            <Link href={`/profile/${sender.id}`} className="font-semibold">
              {sender.name}
            </Link>{" "}
            <span className="text-navTextColor">wants to join</span>{" "}
            <Link
              href={`/guilds/${joinRequest.guild.id}`}
              className="font-semibold"
            >
              {joinRequest.guild.name}
            </Link>{" "}
          </p>
          <NotificationContextMenu notification={notification} />
        </div>

        {/* actions */}
        <div className="flex gap-2">
          <Button
            isLoading={ isAccepting}
            variant="solid"
            color="secondary"
            onClick={() => acceptJoinRequestMutation(joinRequest.id)}
            className="text-white"
            size="sm"
            radius="lg"
          >
            Accept
          </Button>
          <Button
            isLoading={isDeclining}
            variant="bordered"
            onClick={() => declineJoinRequestMutation(joinRequest.id)}
            size="sm"
            radius="lg"
            className="border-2 border-borderColor"
          >
            Decline
          </Button>
        </div>
        {/* date */}
        <p className="self-end text-[.7rem] text-navTextColor md:text-xs">
          {formatDate(notification.createdAt)}
        </p>
      </div>
    </div>
  );
}
