"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { GoKebabHorizontal } from "react-icons/go";
import { PiSignOutBold, } from "react-icons/pi";
import { TbShare3, TbUsers } from "react-icons/tb";
import { useDisclosure } from "@nextui-org/react";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { useLeaveGuild } from "@/lib/services/guild.api";
import { useModalStore } from "@/lib/store/useModalStore";

export default function GuildContextMenu({ guild }: { guild: TGuild }) {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const { mutate: leaveGuildMutation, isPending } = useLeaveGuild(onClose);
  const { openGuildMembersModal } = useModalStore((state) => state);

  const dropdownItems = [
    { text: "Members", key: "members", icon: TbUsers },
    { text: "Share guild", key: "share", icon: TbShare3 },
    { text: "Leave guild", key: "leave", icon: PiSignOutBold },
  ];
  const filteredItems = guild.isBelong
    ? dropdownItems
    : dropdownItems.filter((item) => item.key !== "leave");

  return (
    <>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        action={() => leaveGuildMutation(guild.id)}
        isPending={isPending}
        modalTextContent={{
          header: "Leave guild?",
          body: "Are you sure you want to leave this guild?",
        }}
        buttonText="Leave"
      />
      <Dropdown className="rounded-xl bg-background border border-borderColor" placement="bottom-end">
        <DropdownTrigger>
          <Button
            variant="bordered"
            size="md"
            isIconOnly
            className="z-[5] rounded-xl dark:border-white/60 border-black/60 text-[1.2rem]"
            startContent={<GoKebabHorizontal />}
          />
        </DropdownTrigger>
        <DropdownMenu variant="flat" items={filteredItems} aria-label="guild dropdown">
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

            if (item.key === "members") {
              return (
                <DropdownItem
                  key={item.key}
                  className="rounded-lg"
                  startContent={<item.icon />}
                  onClick={openGuildMembersModal}
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
                onClick={onOpen}
              >
                {item.text}
              </DropdownItem>
            );
          }}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
