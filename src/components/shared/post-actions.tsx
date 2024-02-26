"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FaRegComments, FaComments } from "react-icons/fa";
import { TbArrowBigUp, TbArrowBigUpFilled, TbShare3 } from "react-icons/tb";
import { cn } from "@/utils/cn";
import CustomTooltip from "../ui/custom-tooltip";
import { useState } from "react";
import { useUpvote, useRemoveUpvote } from "@/lib/services/upvote.api";
import formatPostHref from "@/utils/formatPostHref";
import { useDisclosure } from "@nextui-org/react";
import ShareModal from "../ui/share-modal";
import { useModalStore } from "@/lib/store/useModalStore";

export default function PostActions({
  post,
  isInPostPage,
  toggleOpenCommentForm,
  isCommentFormOpen,
}: {
  post: TPost;
  isInPostPage?: boolean;
  toggleOpenCommentForm?: () => void;
  isCommentFormOpen?: boolean;
}) {
  const router = useRouter();
  const { mutate: upvoteMutation } = useUpvote();
  const { mutate: removeUpvoteMutation } = useRemoveUpvote();
  const [postPageState, setPostPageState] = useState<TPost>(post);
  const { onOpen, onOpenChange, isOpen } = useDisclosure();
  const { openShareModal, setPostToShare }  = useModalStore((state) => state)

  // this is for card components
  function handleToggleUpvote() {
    if (post.isUpvoted) {
      removeUpvoteMutation(post.id);
      return;
    }
    upvoteMutation(post.id);
  }

  // this is for post page
  function handleToggleUpvoteInPostPage() {
    if (postPageState.isUpvoted) {
      removeUpvoteMutation(postPageState.id);
      setPostPageState((prevState) => ({
        ...prevState,
        isUpvoted: false,
        upvoteCount: prevState.upvoteCount - 1,
      }));
      return;
    }
    upvoteMutation(postPageState.id);
    setPostPageState((prevState) => ({
      ...prevState,
      isUpvoted: true,
      upvoteCount: prevState.upvoteCount + 1,
    }));
  }

  return (
    <div className="flex w-full items-center justify-between">
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
                "text-[#34FF00]": isInPostPage
                  ? postPageState.isUpvoted
                  : post.isUpvoted,
                "text-[#A1A1AA]": isInPostPage
                  ? !postPageState.isUpvoted
                  : !post.isUpvoted,
              },
            )}
            onClick={(e) => {
              e.preventDefault();
              e.nativeEvent.stopImmediatePropagation();
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
        <p className="font-bold text-[#A1A1AA]">
          {isInPostPage ? postPageState.upvoteCount : post.upvoteCount}
        </p>
      </div>

      <CustomTooltip
        placement="bottom"
        content={
          isInPostPage
            ? isCommentFormOpen
              ? "Close comment form"
              : "Show comment form"
            : "Comments"
        }
      >
        <Button
          isIconOnly
          className={cn(
            `rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA] 
          hover:bg-[#003db647] hover:text-[#639cff]`,
            {
              "text-[#4f85e2]": isCommentFormOpen,
              "text-[#A1A1AA]": !isCommentFormOpen,
            },
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            isInPostPage && toggleOpenCommentForm
              ? toggleOpenCommentForm()
              : router.push(formatPostHref(post));
          }}
        >
          {isInPostPage ? (
            isCommentFormOpen ? (
              <FaComments />
            ) : (
              <FaRegComments />
            )
          ) : (
            <FaRegComments />
          )}
        </Button>
      </CustomTooltip>

      <CustomTooltip placement="bottom" content="Share">
        <Button
          isIconOnly
          className="rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA] 
          hover:bg-[#dd0dba3c] hover:text-[#DD0DB9]"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
            openShareModal()
            setPostToShare(post)
          }}
        >
          <TbShare3 />
        </Button>
      </CustomTooltip>
    </div>
  );
}
