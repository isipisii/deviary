"use client";

import { Tooltip, Button } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";
import { FaRegComments } from "react-icons/fa";
import { TbArrowBigUp, TbShare3 } from "react-icons/tb";
import { cn } from "@/utils/cn";

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
  const router = useRouter();
  const href = `/@${post.author.name.split(" ").join(".")}/${
    post.blog
      ? formatTitle(post.blog?.title, post.id)
      : formatTitle(post.diary?.title as string, post.id)
  }`;
  const selectedOrientation = orientationTypes[orientation ?? "horizontal"];

  function formatTitle(title: string, postId: string) {
    const titleArrayWithPostId = [...title.split(" "), postId];
    const formattedTitleWithDash = titleArrayWithPostId.join("-");

    return formattedTitleWithDash;
  }

  return (
    <div className={cn("flex items-center", selectedOrientation)}>
      <Tooltip
        placement="bottom"
        content="Upvote"
        className="z-10 bg-background"
        showArrow
        classNames={{
          base: [
            // arrow color
            "before:bg-background dark:before:bg-background",
          ],
        }}
      >
        <Button
          isIconOnly
          className="rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA] 
                hover:bg-[#34b60058] hover:text-[#34FF00]"
        >
          <TbArrowBigUp />
        </Button>
      </Tooltip>

      <Tooltip
        placement="bottom"
        content="Comments"
        className="z-10 bg-background"
        showArrow
        classNames={{
          base: [
            // arrow color
            "before:bg-background dark:before:bg-background",
          ],
        }}
      >
        <Button
          isIconOnly
          className="rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA] 
                hover:bg-[#003db647] hover:text-[#639cff]"
          onClick={() => router.push(href)}
        >
          <FaRegComments />
        </Button>
      </Tooltip>

      <Tooltip
        placement="bottom"
        content="Share"
        className="z-10 bg-background"
        showArrow
        classNames={{
          base: [
            // arrow color
            "before:bg-background dark:before:bg-background",
          ],
        }}
      >
        <Button
          isIconOnly
          className="rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA] 
                hover:bg-[#dd0dba3c] hover:text-[#DD0DB9]"
        >
          <TbShare3 />
        </Button>
      </Tooltip>
    </div>
  );
}
