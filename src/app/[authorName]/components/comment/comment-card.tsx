"use client";

import { User, Button, Textarea } from "@nextui-org/react";
import { useState } from "react";
import CommentContextMenu from "@/components/ui/comment-context-menu";
import { useForm } from "react-hook-form";
import { commentSchema, TCommentSchema } from "../post-aside";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditComment } from "@/lib/services/comments.api";

export default function CommentCard({ comment }: { comment: TComment }) {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: editCommentMutation, isPending } =
    useEditComment(closeEditForm);
  const [commentInput, setCommentInput] = useState(comment.content);
  // const {} = useForm({
  //   resolver: zodResolver(commentSchema)
  // })

  function showEditForm() {
    setIsEditing(true);
  }

  function closeEditForm() {
    setIsEditing(false);
  }

  return (
    <div
      className="flex h-auto 
      w-full flex-col justify-between gap-4
      rounded-2xl border border-borderColor p-4"
    >
      <div className="flex justify-between">
        <User
          as="button"
          avatarProps={{
            src: comment.user.image,
            className: "h-[35px] w-[35px]",
          }}
          className="self-start transition-transform"
          name={comment.user.name}
          description={comment?.user.email}
        />
        <CommentContextMenu comment={comment} showEditForm={showEditForm} />
      </div>
      {/* comment */}
      {isEditing ? (
        <div className="flex w-full flex-col gap-2">
          <Textarea
            type="text"
            variant="bordered"
            size="sm"
            maxRows={5}
            isDisabled={isPending}
            defaultValue={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="text-sm"
            classNames={{
              inputWrapper: " border-borderColor border-1 rounded-xl",
            }}
          />
          <div className="flex items-center gap-2 self-end">
            <Button
              onClick={closeEditForm}
              size="sm"
              color="secondary"
              variant="light"
              radius="lg"
              isDisabled={isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              color="secondary"
              radius="lg"
              className="font-semibold text-white"
              isDisabled={isPending}
              isLoading={isPending}
              onClick={() =>
                editCommentMutation({
                  content: commentInput,
                  commentId: comment.id,
                  postId: comment.postId
                })
              }
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <p>{comment.content}</p>
      )}
      {/* <PostActions post={post} isInPostPage={true} /> */}
    </div>
  );
}
