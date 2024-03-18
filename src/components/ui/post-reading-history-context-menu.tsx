"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { GoKebabHorizontal } from "react-icons/go";
import { LuTrash } from "react-icons/lu";
import { useRemoveReadingHistory } from "@/lib/services/reading-history.api";

export default function PostReadingHistoryContextMenu({ readingHistoryId }: { readingHistoryId: string }) {
  const { mutate: removeFromHistoryMutation } = useRemoveReadingHistory()

  return (
    <Dropdown
      className="rounded-xl border border-borderColor bg-cardBg"
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
          className="z-[5] rounded-lg text-[1.2rem]"
          startContent={<GoKebabHorizontal />}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" variant="flat">
        <DropdownItem
          key="delete"
          color="danger"
          className="rounded-lg text-danger"
          startContent={<LuTrash />}
          onPress={() => removeFromHistoryMutation(readingHistoryId)}
        >
          Remove from history
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
