"use client";

import { Button, Textarea, User, TextAreaProps } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateComment, useEditComment } from "@/lib/services/comments.api";
import { cn } from "@/utils/cn";
import z from "zod"

interface ICommentForm {
  postId: string;
  isEditing?: boolean;
  comment?: TComment;
  closeEditForm?: () => void;
  textAreaProps?: TextAreaProps;
  initialValue?: string;
}

const commentSchema = z.object({
  content: z.string().min(1, { message: "Comment is required" }),
});
type TCommentSchema = z.infer<typeof commentSchema>;

export default function CommentForm({
  comment,
  postId,
  isEditing,
  closeEditForm,
  textAreaProps,
  initialValue,
}: ICommentForm) {
  const { data } = useSession();
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
  const { mutate: editCommentMutation, isPending: isUpdatingComment } =
    useEditComment(closeEditForm);

  function handleSubmitEditedComment(formData: TCommentSchema) {
    editCommentMutation({
      content: formData.content,
      commentId: comment?.id as string,
      postId,
    });
  }

  function handleSubmitComment(formData: TCommentSchema) {
    createCommentMutation({ content: formData.content, postId });
  }

  function getButtonText() {
    let text = "";
    if (isEditing) {
      if (isUpdatingComment) {
        text = "Saving";
      }
      text = "Save";
    } else {
      if (isCreatingComment) {
        text = "Commenting";
      }
      text = "Comment";
    }
    return text;
  }

  return (
    <form
      className={cn(
        `flex flex-col gap-4 rounded-3xl 
      border border-borderColor bg-background p-4`,
        {
          "gap-2 border-none p-0": isEditing,
        },
      )}
      onSubmit={handleSubmit(
        isEditing ? handleSubmitEditedComment : handleSubmitComment,
      )}
    >
      {!isEditing && (
        <User
          as="button"
          avatarProps={{
            src: data?.user.image ?? "",
          }}
          className="self-start transition-transform"
          description={data?.user.email}
          name={data?.user.name}
        />
      )}
      <Textarea
        {...textAreaProps}
        variant="bordered"
        classNames={{
          label: "font-semibold",
          inputWrapper: `border-borderColor border-1 ${isEditing ? "rounded-xl" : "rounded-2xl"}`,
        }}
        {...register("content")}
        defaultValue={initialValue}
        errorMessage={errors.content?.message}
        isInvalid={!!errors.content}
      />
      <div className="flex items-center gap-2 self-end">
        {isEditing && (
          <Button
            onClick={closeEditForm}
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
          isDisabled={isUpdatingComment || isCreatingComment}
          isLoading={isUpdatingComment || isCreatingComment}
        >
          {isUpdatingComment &&  "Updating" || isEditing && "Update" || isCreatingComment && "Commenting" || "Comment"}
        </Button>
      </div>
    </form>
  );
}
