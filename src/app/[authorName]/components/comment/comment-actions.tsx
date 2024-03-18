"use client";

import CustomTooltip from "@/components/ui/custom-tooltip";
import { cn } from "@/utils/cn";
import { Button } from "@nextui-org/react";
import { FaRegComments } from "react-icons/fa6";
import { TbArrowBigUp, TbArrowBigUpFilled, TbShare3 } from "react-icons/tb";
import { useUpvoteComment, useRemoveUpvoteComment } from "@/lib/services/upvote-comment.api";
import { useModalStore } from "@/lib/store/useModalStore";
import { useSession } from "next-auth/react";

export default function CommentActions({ toggleReplyForm, comment }: { toggleReplyForm: () => void, comment: TComment }) {
  const { status } = useSession()
  const { openUnauthenticatedModal } = useModalStore(state => state)
  const { mutate: upvoteCommentMutation } = useUpvoteComment()
  const { mutate: removeCommentUpvoteMutation } = useRemoveUpvoteComment()

  function handleUpvote() {
    if(status === "unauthenticated") {
      openUnauthenticatedModal()
      return
    }
    
    comment.isUpvoted ? removeCommentUpvoteMutation(comment) : upvoteCommentMutation(comment) 
  }

  return (
    <div className="flex gap-9 items-center">
      <div className="flex items-center gap-1">
        <CustomTooltip placement="bottom" content="Upvote">
          <Button
            isIconOnly
            className={cn(
              `rounded-xl bg-[#fff0] text-xl text-[#A1A1AA]
           hover:bg-[#34b6003b] hover:text-[#34FF00]`,
              {
                "text-[#34FF00]": comment.isUpvoted,
                "text-[#A1A1AA]": !comment.isUpvoted,
              },
            )}
            onClick={handleUpvote}
          >
            {comment.isUpvoted ? <TbArrowBigUpFilled /> : <TbArrowBigUp />}
          </Button>
        </CustomTooltip>
        <p className="font-bold text-[#A1A1AA]">{comment.upvoteCount}</p>
      </div>

      <CustomTooltip placement="bottom" content={"Reply"}>
        <Button
          isIconOnly
          className={cn(
            `rounded-xl bg-[#fff0] text-xl text-[#A1A1AA] 
        hover:bg-[#003db647] hover:text-[#639cff]`,
          )}
          onClick={toggleReplyForm}
        >
          <FaRegComments />
        </Button>
      </CustomTooltip>
    </div>
  );
}
