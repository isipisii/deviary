/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
  DropdownSection,
  useDisclosure,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";

import { PiSignOutBold } from "react-icons/pi";
import { LuSettings, LuUser2 } from "react-icons/lu";
import ConfirmationModal from "./confirmation-modal";

export default function AccountDropdown() {
  const { data } = useSession();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isPending, setIsPending] = useState(false)

  async function handleLogout(){
    try {
      setIsPending(true)
      await signOut();
      setIsPending(false)

      router.push("/sign-in");
    } catch (error) {
      console.log(error)
    }
  
  }
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
      />

      <Dropdown
        placement="bottom-start"
        backdrop="transparent"
        className="bg-background"
      >
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              src: data?.user?.image ?? "",
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
