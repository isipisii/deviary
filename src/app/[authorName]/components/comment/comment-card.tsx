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

export default function CommentCard({ comment }: { comment: TComment }) {
  const [isEditing, setIsEditing] = useState(false);
  const { data } = useSession();

  function showEditForm() {
    setIsEditing(true);
  }

  function closeEditForm() {
    setIsEditing(false);
  }

  return (
    <div className="border">
      <div
        className="flex h-auto 
        w-full flex-col justify-between gap-4
        rounded-2xl border border-borderColor p-4"
      >
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <User
              as="button"
              avatarProps={{
                src: comment.user.image,
                className: "h-[35px] w-[35px]",
                isBordered: true,
              }}
              className="self-start transition-transform"
              classNames={{
                description: "text-navTextColor",
                name: "font-medium",
              }}
              name={comment.user.name}
              description={formatDate(comment.createdAt)}
            />
            {comment.post && comment.userId === comment.post.authorId && (
              <p className="text-md -mt-1  text-warning">
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
            closeEditForm={closeEditForm}
            isEditing={true}
            textAreaProps={{ maxRows: 5, className: "text-sm" }}
            postId={comment.postId}
            initialValue={comment.content}
          />
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm">
            {comment.content}
          </p>
        )}
        <CommentActions />
      </div>

      {/* TODO: PUT THE REPLIES HERE */}
      { comment.childReplies.length > 0 && <CommentReplies commentReplies={comment.childReplies} />}
    </div>
  );
}
