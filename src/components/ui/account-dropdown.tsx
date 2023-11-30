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

export default function AccountDropdown() {
  const { data, status } = useSession();
  const isAuthenticated = status === "authenticated"
  const router = useRouter()

  // TODO: make a loader
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
          <DropdownItem key="profile">
            Profile
          </DropdownItem>
          <DropdownItem key="settings">
            My Settings
          </DropdownItem>
        </DropdownSection>
        <DropdownItem 
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
