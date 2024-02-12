"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { GoKebabHorizontal } from "react-icons/go";
import { TbShare3 } from "react-icons/tb";

export default function GuildContextMenu() {

  return (
    <Dropdown
      className="rounded-xl border border-borderColor bg-background"
      placement="bottom-end"
    >
      <DropdownTrigger>
        <Button
          variant="light"
          size="md"
          isIconOnly
          className="z-[5] rounded-xl text-[1.2rem]"
          startContent={<GoKebabHorizontal />}
        />
      </DropdownTrigger>
      <DropdownMenu variant="flat">
        <DropdownItem
          key="share"
          // color={item.key === "delete" ? "danger" : "default"}
          // className={item.key === "delete" ? "text-danger" : ""}
          className="rounded-lg"
          startContent={<TbShare3 />}
        >
          Share squad
        </DropdownItem>
        <DropdownItem
          key="leave"
          // color={item.key === "delete" ? "danger" : "default"}
          // className={item.key === "delete" ? "text-danger" : ""}
          className="rounded-lg text-danger"
          color="danger"
        >
          Leave guild
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
