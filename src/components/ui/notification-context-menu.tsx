"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Spinner,
} from "@nextui-org/react";
import { GoKebabHorizontal } from "react-icons/go";
import { FaRegEye } from "react-icons/fa6";
import { LuTrash } from "react-icons/lu";
import {
  useDeleteNotification,
  useViewNotification,
} from "@/lib/services/notifications.api";

interface INotificationContextMenu {
  notification: TNotification;
}

export default function NotificationContextMenu({
  notification,
}: INotificationContextMenu) {
  const { mutate: deleteNotificationMutation, isPending } =
    useDeleteNotification();
  const { mutate: viewNotificationMutation } =
    useViewNotification();

  return (
    <Dropdown
      className="rounded-xl border border-borderColor bg-background"
      placement="bottom-end"
    >
      <DropdownTrigger
        onClick={(e) => {
          e.preventDefault();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        <Button
          variant="light"
          size="sm"
          isIconOnly
          className="z-[5] rounded-lg text-[1rem]"
          startContent={<GoKebabHorizontal />}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dynamic Actions"
        variant="flat"
        disabledKeys={isPending ? ["delete"] : notification.viewed ? ["view"] : undefined}
      >
        <DropdownItem
          key="delete"
          startContent={
            isPending ? <Spinner size="sm" color="danger" /> : <LuTrash />
          }
          className="rounded-lg text-danger"
          color="danger"
          onClick={() => deleteNotificationMutation(notification.id)}
        >
          {isPending ? "Deleting" : "Delete"}
        </DropdownItem>
        <DropdownItem
          key="view"
          startContent={<FaRegEye />}
          className="rounded-lg"
          onClick={() => viewNotificationMutation(notification.id)}
        >
          {notification.viewed ? "Viewed" : "Mark as viewed"}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
