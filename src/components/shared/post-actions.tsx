"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FaRegComments } from "react-icons/fa";
import { TbArrowBigUp, TbArrowBigUpFilled, TbShare3 } from "react-icons/tb";
import { cn } from "@/utils/cn";
import CustomTooltip from "../ui/custom-tooltip";
import { useCallback, useState } from "react";
import { useUpvote, useRemoveUpvote } from "@/lib/services/upvote.api";
import formatPostHref from "@/utils/formatPostHref";

export default function PostActions({
  post,
  isInPostPage,
}: {
  post: TPost;
  isInPostPage?: boolean;
}) {
  const router = useRouter();
  const { mutate: upvoteMutation } = useUpvote();
  const { mutate: removeUpvoteMutation } = useRemoveUpvote()
  const [postPageState, setPostPageState] = useState<TPost>(post)

  // this is for card com ponents
  const handleToggleUpvote = useCallback(() => {
    if (post.isUpvoted) {
      removeUpvoteMutation(post.id);
      return;
    }
    upvoteMutation(post.id);
  }, [post.id, removeUpvoteMutation, upvoteMutation, post.isUpvoted]);

  // this is for post page
  const handleToggleUpvoteInPostPage = useCallback(() => {
    if (postPageState.isUpvoted) {
      removeUpvoteMutation(postPageState.id);
      setPostPageState(prevState => ({
        ...prevState,
        isUpvoted: false,
        upvoteCount: prevState.upvoteCount - 1
      }))
      return;
    }
    upvoteMutation(postPageState.id);
    setPostPageState(prevState => ({
      ...prevState,
      isUpvoted: true,
      upvoteCount: prevState.upvoteCount + 1
    }))
  }, [
    postPageState,
    removeUpvoteMutation,
    upvoteMutation
  ]);

  return (
    <div
      className="flex w-full items-center justify-between"
      data-nprogress-action={true}
    >
      <div className="flex items-center gap-1">
        <CustomTooltip
          placement="bottom"
          content={
            isInPostPage
              ? postPageState.isUpvoted
                ? "Remove Upvote"
                : "Upvote"
              : post.isUpvoted
                ? "Remove Upvote"
                : "Upvote"
          }
        >
          <Button
            isIconOnly
            className={cn(
              `rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA]
             hover:bg-[#34b6003b] hover:text-[#34FF00]`,
              {
                "text-[#34FF00]": isInPostPage ? postPageState.isUpvoted : post.isUpvoted,
                "text-[#A1A1AA]": isInPostPage ? !postPageState.isUpvoted : !post.isUpvoted,
              },
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isInPostPage
                ? handleToggleUpvoteInPostPage()
                : handleToggleUpvote();
            }}
          >
            {isInPostPage ? (
              postPageState.isUpvoted ? (
                <TbArrowBigUpFilled />
              ) : (
                <TbArrowBigUp />
              )
            ) : post.isUpvoted ? (
              <TbArrowBigUpFilled />
            ) : (
              <TbArrowBigUp />
            )}
          </Button>
        </CustomTooltip>
        <p className="text-[#A1A1AA]">
          {isInPostPage ? postPageState.upvoteCount : post.upvoteCount}
        </p>
      </div>

      <CustomTooltip placement="bottom" content="Comments">
        <Button
          isIconOnly
          className="rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA] 
                hover:bg-[#003db647] hover:text-[#639cff]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(formatPostHref(post));
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
