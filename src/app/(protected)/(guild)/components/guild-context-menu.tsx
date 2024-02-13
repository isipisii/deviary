"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { GoKebabHorizontal } from "react-icons/go";
import { PiSignOutBold } from "react-icons/pi";
import { TbShare3 } from "react-icons/tb";

export default function GuildContextMenu() {

  return (
    <Dropdown
      className="rounded-xl border border-borderColor bg-background"
      placement="bottom-end"
    >
      <DropdownTrigger>
        <Button
          variant="bordered"
          size="md"
          isIconOnly
          className="z-[5] rounded-xl text-[1.2rem] border-1 border-borderColor"
          startContent={<GoKebabHorizontal />}
        />
      </DropdownTrigger>
      <DropdownMenu variant="flat">
        <DropdownItem
          key="share"
          className="rounded-lg"
          startContent={<TbShare3 />}
        >
          Share guild
        </DropdownItem>
        <DropdownItem
          key="leave"
          className="rounded-lg text-danger"
          color="danger"
          startContent={
            <PiSignOutBold />
          }
        >
          Leave guild
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
