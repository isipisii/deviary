/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
  DropdownSection,
  useDisclosure,
} from "@nextui-org/react";

import { PiSignOutBold } from "react-icons/pi";
import { LuSettings, LuUser2 } from "react-icons/lu";
import ConfirmationModal from "./confirmation-modal";

import useLogout from "@/lib/hooks/useLogout";

export default function AccountDropdown() {
  const { data } = useSession();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {  handleLogout, isPending } = useLogout(onClose)

  return (
    <>  
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        action={handleLogout}
        isPending={isPending}
        modalTextContent={{
          header: "Log out?",
          body: "Are you sure you want to log out?",
        }}
        isDelete={false}
        buttonText="Log out"
      />

      <Dropdown
        placement="bottom-end"
        backdrop="transparent"
        className="bg-background border border-borderColor"
      >
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              src: data?.user?.image ?? "",
              isBordered: true
            }}
            classNames={{
              description: "text-navTextColor",
              name: "font-medium",
            }}
            className="transition-transform"
            description={data?.user.email}
            name={data?.user.name}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownSection showDivider>
            <DropdownItem key="profile" startContent={<LuUser2 />}>
              Profile
            </DropdownItem>
            <DropdownItem key="settings" startContent={<LuSettings />}>
              My Settings
            </DropdownItem>
          </DropdownSection>
          <DropdownItem
            startContent={<PiSignOutBold />}
            key="logout"
            color="danger"
            onClick={onOpen}
            className="text-danger"
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
