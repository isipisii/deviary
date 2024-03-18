"use client";

import {
  Button,
  Textarea,
  User,
  TextAreaProps,
  Avatar,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useCreateComment,
  useEditComment,
  useCreateReply,
} from "@/lib/services/comments.api";
import { cn } from "@/utils/cn";
import z from "zod";
import { useParams } from "next/navigation";
import { useModalStore } from "@/lib/store/useModalStore";

interface ICommentForm {
  isEditing?: boolean;
  isReply?: boolean;
  comment?: TComment;
  closeForm?: () => void;
  textAreaProps?: TextAreaProps;
  initialValue?: string;
}

const commentSchema = z.object({
  content: z.string().min(1, { message: "Content is required" }),
});
type TCommentSchema = z.infer<typeof commentSchema>;

export default function CommentForm({
  comment,
  isEditing,
  isReply,
  closeForm,
  textAreaProps,
  initialValue,
}: ICommentForm) {
  const { openUnauthenticatedModal } = useModalStore(state => state)
  const params = useParams<{ authorName: string, postTitle: string}>()
  const postId = params.postTitle.split("-").at(-1) as string
  const { data, status } = useSession();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<TCommentSchema>({
    resolver: zodResolver(commentSchema),
  });

  const { mutate: createCommentMutation, isPending: isCreatingComment } =
    useCreateComment(reset);
  const { mutate: createReplyMutation, isPending: isCreatingReply } =
    useCreateReply(closeForm);
  const { mutate: editCommentMutation, isPending: isUpdatingComment } =
    useEditComment(closeForm);

  function handleSubmitEditedComment(formData: TCommentSchema) {
    editCommentMutation({
      content: formData.content,
      commentId: comment?.id as string,
      postId,
    });
  }

  function handleSubmitComment(formData: TCommentSchema) {
    if(status === "unauthenticated") {
      openUnauthenticatedModal()
      return
    } 

    createCommentMutation({ content: formData.content, postId });
  }

  function handleSubmitReply(formData: TCommentSchema) {
    if(status === "unauthenticated") {
      openUnauthenticatedModal()
      return
    } 

    if (!comment) return;
    createReplyMutation({
      content: formData.content,
      commentId: comment?.id,
      rootCommentId: comment?.rootCommentId ?? comment?.id,
      postId
    });
  }

  return (
    <form
      className={cn(
        `flex flex-col gap-3 rounded-3xl 
       bg-background p-3`,
        {
          "gap-2 border-none p-0": isEditing,
        },
      )}
      onSubmit={handleSubmit(
        isReply ? handleSubmitReply : isEditing ? handleSubmitEditedComment : handleSubmitComment,
      )}
    >
      <div className="flex gap-3 justify-between">
        {!isEditing && (
          <Avatar
            src={data?.user.image as string}
            isBordered
            className="h-[35px] w-[35px]"
          />
        )}
        <Textarea
          {...textAreaProps}
          variant="bordered"
          classNames={{
            label: "font-semibold",
            inputWrapper: `border-borderColor border-1 rounded-xl`,
          }}
          className={isEditing ? "w-full" : "w-[90%]"}
          {...register("content")}
          defaultValue={initialValue}
          errorMessage={errors.content?.message}
          isInvalid={!!errors.content}
        />
      </div>

      <div className="flex items-center gap-2 self-end">
        {isEditing && (
          <Button
            onClick={closeForm}
            size="sm"
            color="secondary"
            variant="light"
            radius="lg"
            isDisabled={isUpdatingComment}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size={isEditing ? "sm" : "md"}
          color="secondary"
          radius="lg"
          className="font-semibold text-white"
          isDisabled={
            isUpdatingComment || isCreatingComment || isCreatingReply
          }
          isLoading={isUpdatingComment || isCreatingComment || isCreatingReply}
        >
          {(isUpdatingComment && "Updating") ||
            (isEditing && "Update") ||
            (isCreatingComment && "Commenting") ||
            (isReply && "Reply") ||
            "Comment"}
        </Button>
      </div>
    </form>
  );
}
