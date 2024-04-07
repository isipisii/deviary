"use client";

import React from "react";
import { Avatar, Button, Image } from "@nextui-org/react";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import formatDate from "@/utils/formatDate";
import CustomTooltip from "@/components/ui/custom-tooltip";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ProfileDetails({ user }: { user?: TUser }) {
  const { data } = useSession();
  const isAuthenticatedUsersProfile = data?.user.id === user?.id;

  function getSocialUsername(url: string) {
    return new URL(url).pathname.split("").slice(1).join("");
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="w-full">
        <Image
          isBlurred
          src={user?.backgroundImage?.imageUrl}
          alt="Cover image"
          removeWrapper
          className="left-0 top-0 z-[0] h-[150px] w-full rounded-xl object-cover"
        />

        <div className="z-[10] -mt-10 flex flex-col gap-3 px-4">
          <Avatar
            src={user?.image}
            isBordered
            className="h-[90px] w-[90px] md:h-[130px] md:w-[130px]"
          />

          <div>
            <div className="flex justify-between ">
              <h2 className="text-[1.4rem] font-bold md:text-2xl">
                {user?.name}
              </h2>
              <CustomTooltip content="Profile settings">
                {isAuthenticatedUsersProfile && (
                  <Button
                    isIconOnly
                    as={Link}
                    href="/settings/profile"
                    color="secondary"
                    variant="light"
                    className="rounded-lg"
                  >
                    <FiSettings className="text-xl" />
                  </Button>
                )}
              </CustomTooltip>
            </div>

            <p className="text-sm">
              @{user?.username}{" "}
              <span className="font-semibold text-navTextColor">
                {" "}
                • Joined {formatDate(user?.createdAt as Date)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4">
        {user?.bio && <p>{user?.bio}</p>}
        <div className="flex gap-2">
          {user?.social?.github && (
            <a
              href={user?.social?.github}
              target="_blank"
              className="flex items-center gap-1 rounded-lg border border-borderColor px-3 py-2"
            >
              <p className="text-xl text-navTextColor">
                <FaGithub />
              </p>
              <p className="text-sm text-navTextColor">
                @{getSocialUsername(user.social.github)}
              </p>
            </a>
          )}

          {user?.social?.facebook && (
            <a
              href={user?.social?.facebook}
              target="_blank"
              className="flex items-center gap-1 rounded-lg border border-borderColor px-3 py-2"
            >
              <p className="text-xl text-navTextColor">
                <FaFacebook />
              </p>
              <p className="text-sm text-navTextColor">
                @{getSocialUsername(user.social.facebook)}
              </p>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
