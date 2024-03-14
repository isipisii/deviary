"use client";

import { User } from "@nextui-org/react";
import { useState } from "react";
import CommentContextMenu from "@/components/ui/comment-context-menu";
import CommentForm from "./comment-form";
import { useSession } from "next-auth/react";
import CommentActions from "./comment-actions";
import formatDate from "@/utils/formatDate";
import { FaMedal } from "react-icons/fa6";
import CommentReplies from "./comment-replies";

// TODO: DO THE UI FOR REPLY. MAKE THE DETAILS SMALLER in order to highlight the root comment
export default function CommentCard({
  comment,
  postAuthorId,
  isReply,
}: {
  comment: TComment;
  postAuthorId: string;
  isReply?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const { data } = useSession();

  function showEditForm() {
    setIsEditing(true);
  }

  function closeEditForm() {
    setIsEditing(false);
  }

  function toggleReplyForm() {
    setIsReplying(prevState => !prevState);
  }

  function closeReplyForm() {
    setIsReplying(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`flex h-auto 
        w-full flex-col justify-between
        rounded-2xl border border-borderColor p-4 ${
          isReply ? "gap-3" : "gap-4"
        }`}
      >
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <User
              as="button"
              avatarProps={{
                src: comment.user.image,
                className: isReply ? "h-[25px] w-[25px]" : "h-[35px] w-[35px]",
                isBordered: true,
              }}
              className="self-start transition-transform"
              classNames={{
                description: `text-navTextColor ${
                  isReply ? "text-[.7rem]" : null
                }`,
                name: `font-medium ${isReply ? "text-[.75rem]" : null}`,
              }}
              name={comment.user.name}
              description={formatDate(comment.createdAt)}
            />
            {comment.userId === postAuthorId && (
              <p className="text-md  -mt-2 text-warning">
                <FaMedal />
              </p>
            )}
          </div>
          {data?.user.id === comment.userId && (
            <CommentContextMenu comment={comment} showEditForm={showEditForm} />
          )}
        </div>
        {/* comment */}
        {isEditing ? (
          <CommentForm
            comment={comment}
            closeForm={closeEditForm}
            isEditing={true}
            textAreaProps={{ maxRows: 5, className: "text-sm" }}
            initialValue={comment.content}
          />
        ) : (
          <p
            className={`flex items-center gap-2 whitespace-pre-wrap break-words ${
              isReply ? "text-[.8rem]" : "text-[.875rem]"
            }`}
          >
            {isReply && (
              <span className="rounded-lg bg-secondary/20 px-2 py-1 font-semibold text-secondary">
                @{comment.parent.user.name.toLowerCase().replaceAll(" ", "")}
              </span>
            )}
            {comment.content}
          </p>
        )}
        <CommentActions toggleReplyForm={toggleReplyForm} comment={comment} />
      </div>
      {isReplying && (
        <CommentForm
          comment={comment}
          closeForm={closeReplyForm}
          textAreaProps={{ maxRows: 5, className: "text-sm", placeholder: `Reply to @${comment.user.name.toLowerCase().replaceAll(" ", "")} `}}
          isReply={true}
        />
      )}
      {comment.commentReplies && comment.commentReplies.length > 0 && (
        <CommentReplies
          commentReplies={comment.commentReplies}
          postAuthorId={postAuthorId}
        />
      )}
    </div>
  );
}
