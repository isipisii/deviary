"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
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

// TODO: finish the delete and view mutation
export default function NotificationContextMenu({
  notification,
}: INotificationContextMenu) {
  const { mutate: deleteNotificationMutation, isPending } =
    useDeleteNotification();

  return (
    <div data-nprogress-action={true}>
      <Dropdown
        className="rounded-xl border border-borderColor bg-background"
        placement="bottom-end"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <DropdownTrigger
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
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
          disabledKeys={isPending ? ["delete"] : undefined}
        >
          <DropdownItem
            key="delete"
            startContent={<LuTrash />}
            className="rounded-lg text-danger"
            color="danger"
            onClick={() => deleteNotificationMutation(notification.id)}
          >
            Delete
          </DropdownItem>
          <DropdownItem
            key="view"
            startContent={<FaRegEye />}
            className="rounded-lg"
          >
            Mark as viewed
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
