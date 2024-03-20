import { Avatar } from "@nextui-org/react";
import Link from "next/link";
import NotificationContextMenu from "../ui/notification-context-menu";
import formatDate from "@/utils/formatDate";

export default function NotificationCard({
  notification,
  message
}: {
  notification: TNotification;
  message: string
}) {
  const { sender, guild, createdAt } = notification;

  return (
    <Link href={`/guild/${guild.id}`} className="w-full">
      <div className="relative flex w-full gap-4 p-5 transition-all duration-1000 ease-in-out hover:bg-[#a8a7a716] ">
        {!notification.viewed && (
          <div className="absolute left-6 bottom-4 h-[10px] w-[10px] rounded-full bg-secondary" />
        )}

        {/* sender's avatar */}
        <div className="relative h-[30px] w-[30px] md:h-[35px] md:w-[35px]">
          <Avatar
            src={sender?.image}
            showFallback
            isBordered
            className="h-[30px] w-[30px] md:h-[35px] md:w-[35px]"
          />
          <div className="absolute -bottom-2 -right-2 rounded-full bg-background p-1">
            <Avatar
              src={notification.guild.image.imageUrl}
              alt="guild logo"
              className="h-4 w-4 rounded-full"
            />
          </div>
        </div>

        <div className="flex w-[90%] flex-col gap-3">
          {/* sender */}
          <div className="flex items-center justify-between">
            <p className="text-[.8rem] md:text-[.93rem]">
              <Link href={`/profile/${sender.id}`} className="font-semibold">
                {sender.name}
              </Link>{" "}
              <span className="text-navTextColor">{message}</span> {" "}
              <Link href={`/guild/${guild.id}`} className="font-semibold">
                {guild.name}
              </Link>
            </p>
            <NotificationContextMenu notification={notification} />
          </div>

          <p className="self-end text-[.7rem] text-navTextColor md:text-xs">
            {formatDate(createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
