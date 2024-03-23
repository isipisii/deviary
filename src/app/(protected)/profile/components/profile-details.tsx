import React from "react";
import { Avatar, Image } from "@nextui-org/react";
import { FaGithub, FaFacebook } from "react-icons/fa";
import formatDate from "@/utils/formatDate";

export default function ProfileDetails({ user }: { user?: TUser }) {
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
            <h2 className="text-[1.4rem] font-bold md:text-2xl">
              {user?.name}
            </h2>
            <p className="text-sm">
              @{user?.name.toLowerCase()}{" "}
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
