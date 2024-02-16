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

export default function GuildContextMenu({ guild }: { guild: TGuild }) {
  const dropdownItems = [
    { text: "Share guild", key: "share", icon: TbShare3 },
    { text: "Leave guild", key: "leave", icon: PiSignOutBold },
  ];
  const filteredItems = guild.isBelong
    ? dropdownItems
    : dropdownItems.filter((item) => item.key !== "leave");

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
          className="z-[5] rounded-xl border-1 border-borderColor text-[1.2rem]"
          startContent={<GoKebabHorizontal />}
        />
      </DropdownTrigger>
      <DropdownMenu variant="flat" items={filteredItems}>
        {(item) => {
          if (item.key === "share") {
            return (
              <DropdownItem
                key={item.key}
                className="rounded-lg"
                startContent={<item.icon />}
              >
                {item.text}
              </DropdownItem>
            );
          }
          return (
            <DropdownItem
              key={item.key}
              className="rounded-lg text-danger"
              color="danger"
              startContent={<item.icon />}
            >
              {item.text}
            </DropdownItem>
          );
        }}
      </DropdownMenu>
    </Dropdown>
  );
}