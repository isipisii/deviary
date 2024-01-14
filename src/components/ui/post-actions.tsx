"use client";

import { Tooltip, Button } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";
import { FaRegComments } from "react-icons/fa";
import { TbArrowBigUp, TbShare3 } from "react-icons/tb";
import { cn } from "@/utils/cn";
import { formatTitleWithId } from "@/utils/fornatTitleWithId";
import CustomTooltip from "./custom-tooltip";

type TOrientation = "vertical" | "horizontal";

const orientationTypes: Record<string, string> = {
  vertical: "gap-4 flex-col",
  horizontal: "justify-between",
};

export default function PostActions({
  post,
  orientation,
}: {
  post: TPost;
  orientation?: TOrientation;
}) {
  const selectedOrientation = orientationTypes[orientation ?? "horizontal"];
  const router = useRouter();
  const href = `/@${post.author.name.split(" ").join(".")}/${
    post.blog
      ? formatTitleWithId(post.blog?.title, post.id)
      : formatTitleWithId(post.diary?.title as string, post.id)
  }`;


  return (
    <div className={cn("flex items-center", selectedOrientation)}>
      <CustomTooltip
        placement="bottom"
        content="Upvote"
      >
        <Button
          isIconOnly
          className="rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA] 
                hover:bg-[#34b60058] hover:text-[#34FF00]"
        >
          <TbArrowBigUp />
        </Button>
      </CustomTooltip>

      <CustomTooltip
        placement="bottom"
        content="Comments"
      >
        <Button
          isIconOnly
          className="rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA] 
                hover:bg-[#003db647] hover:text-[#639cff]"
          onClick={() => router.push(href)}
        >
          <FaRegComments />
        </Button>
      </CustomTooltip>

      
      <CustomTooltip
        placement="bottom"
        content="Share"
      >
        <Button
          isIconOnly
          className="rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA] 
                hover:bg-[#dd0dba3c] hover:text-[#DD0DB9]"
        >
          <TbShare3 />
        </Button>
      </CustomTooltip>
    </div>
  );
}
