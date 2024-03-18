import React from "react";
import { Avatar, Image } from "@nextui-org/react";
import { FaGithub, FaFacebook } from "react-icons/fa";
import formatDate from "@/utils/formatDate";

// TODO: ADD BG IMAGE
export default function ProfileDetails({ user }: { user?: TUser }) {

  function getSocialUsername(url: string) {
    return new URL(url).pathname.split("").slice(1).join("");
  }
  
  return (
    <div className="flex w-full flex-col gap-[6rem]">
      <div className="relative w-full">
        <Image
          isBlurred
          src="https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg"
          alt="thumbnail"
          removeWrapper
          className="left-0 top-0 z-[5] h-[150px] w-full rounded-xl object-cover"
        />

        <div className="absolute md:-bottom-[50%] -bottom-[40%] left-8 z-[6] flex items-end gap-3">
          <Avatar
            src={user?.image}
            isBordered
            className="md:h-[150px] md:w-[150px] h-[120px] w-[120px]"
          />
          <div>
            <h2 className="md:text-2xl text-[1.3rem] font-bold">{user?.name}</h2>
            <p className="md:text-sm text-[.75rem]">
              @{user?.name.toLowerCase()}{" "}
              <span className="font-semibold text-navTextColor">
                {" "}
                • Joined {formatDate(user?.createdAt as Date)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-8">
        {user?.bio && <p>{user?.bio}</p>}
        <div className="flex gap-2">
          {user?.social?.github && (
            <div className="flex items-center gap-1 rounded-lg border border-borderColor px-3 py-2">
              <a
                className="text-xl text-navTextColor"
                href={user?.social?.github}
              >
                <FaGithub />
              </a>
              <p className="text-sm text-navTextColor">
                @{getSocialUsername(user.social.github)}
              </p>
            </div>
          )}

          {user?.social?.facebook && (
            <div className="flex items-center gap-1 rounded-lg border border-borderColor px-3 py-2">
              <a
                className="text-xl text-navTextColor"
                href={user?.social?.facebook}
              >
                <FaFacebook />
              </a>
              <p className="text-sm text-navTextColor">
                @{getSocialUsername(user.social.facebook)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
