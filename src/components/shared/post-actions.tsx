"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";
import { FaRegComments } from "react-icons/fa";
import { TbArrowBigUp, TbArrowBigUpFilled, TbShare3 } from "react-icons/tb";
import { cn } from "@/utils/cn";
import CustomTooltip from "../ui/custom-tooltip";
import { useState, useCallback } from "react";
import { useUpvote, useRemoveUpvote } from "@/lib/services/upvote.api";
import formatPostHref from "@/utils/formatPostHref";

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
  const selectedOrientation = orientationTypes[orientation ?? "horizontal"];
  const { mutate: upvoteMutation, isPending } = useUpvote();
  const { mutate: removeUpvoteMutation } = useRemoveUpvote();

  // const [isUpvoted, setIsUpvoted] = useState(post.isUpvoted)
  // const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount)

  const handleToggleUpvote = useCallback(() => {
    if (post.isUpvoted) {
      removeUpvoteMutation(post.id);
      // setUpvoteCount(prevCount => prevCount - 1)
      // setIsUpvoted(false)
      return;
    }
    upvoteMutation(post.id);
    // setUpvoteCount(prevCount => prevCount + 1)
    // setIsUpvoted(true)
  }, [post.id, removeUpvoteMutation, upvoteMutation, post.isUpvoted]);

  return (
    <div className={cn("flex items-center", selectedOrientation)}>
      <div className="flex items-center gap-1">
        <CustomTooltip
          placement="bottom"
          content={post.isUpvoted ? "Remove Upvote" : "Upvote"}
        >
          <Button
            isIconOnly
            className={cn(
              `rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA]
             hover:bg-[#34b6003b] hover:text-[#34FF00]`,
              {
                "text-[#34FF00]": post.isUpvoted,
                "text-[#A1A1AA]": !post.isUpvoted,
              },
            )}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleToggleUpvote()
            }}
          >
            {post.isUpvoted ? <TbArrowBigUpFilled /> : <TbArrowBigUp />}
          </Button>
        </CustomTooltip>
        <p className="text-[#A1A1AA]">{post.upvoteCount}</p>
      </div>

      <CustomTooltip placement="bottom" content="Comments">
        <Button
          isIconOnly
          className="rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA] 
                hover:bg-[#003db647] hover:text-[#639cff]"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            router.push(formatPostHref(post))
          }}
        >
          <FaRegComments />
        </Button>
      </CustomTooltip>

      <CustomTooltip placement="bottom" content="Share">
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
