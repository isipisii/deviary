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
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useRouter } from 'next-nprogress-bar';

import { FaRegUser } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { LuSettings, LuUser2 } from "react-icons/lu";

export default function AccountDropdown() {
  const { data } = useSession();
  const router = useRouter()

  return (
    <Dropdown placement="bottom-start" backdrop="transparent" className="bg-background">
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
          startContent={<PiSignOutBold  />}
          key="logout" 
          color="danger" 
          onClick={async () =>  {
            await signOut()
            router.push("/sign-in")
          }}
          className="text-danger"
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
