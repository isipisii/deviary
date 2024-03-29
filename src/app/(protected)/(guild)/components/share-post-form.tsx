"use client";

import {
  useSharePost,
  useUpdateSharedPost,
} from "@/lib/services/guild-shared-posts.api";
import { Button, Textarea, User } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { SharedBlogPostCard, SharedDiaryCard } from "./guild-shared-post-card";

export default function SharePostForm({
  postToShare,
  guildId,
  closeModal,
  guildName,
  initialValue,
  shareId,
  isEditing,
}: {
  postToShare: TPost;
  guildId: string;
  closeModal: () => void;
  guildName?: string;
  initialValue?: string;
  shareId?: string;
  isEditing?: boolean;
}) {
  const { mutate: sharePostMutation, isPending: isSharing } =
    useSharePost(closeModal);
  const { mutate: updateSharedPostMutation, isPending: isUpdating } =
    useUpdateSharedPost(closeModal);

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<{ content: string }>();
  const { data } = useSession();

  function handleSharePost(formData: { content: string }) {
    sharePostMutation({
      content: formData.content,
      guildId,
      postId: postToShare.id,
    });
  }

  function handleUpdateSharedPost(formData: { content: string }) {
    console.log(shareId, formData)
    if (!shareId) return;
    updateSharedPostMutation({
      content: formData.content,
      guildId,
      shareId,
    });
  }

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={handleSubmit(
        isEditing ? handleUpdateSharedPost : handleSharePost,
      )}
    >
      <User
        avatarProps={{
          src: data?.user.image as string,
          isBordered: true,
          className: "h-[35px] w-[35px]",
        }}
        name={data?.user.name}
        description={data?.user.email}
        classNames={{
          description: "text-navTextColor",
          name: "font-semibold",
        }}
        className="self-start"
      />
      <Textarea
        minRows={2}
        maxRows={5}
        {...register("content", {
          maxLength: 300,
        })}
        errorMessage={
          errors.content?.type === "maxLength"
            ? "Content should not exceed to 300 characters"
            : null
        }
        isInvalid={!!errors.content}
        placeholder="Share your thoughts"
        variant="bordered"
        className="rounded-xl"
        classNames={{
          label: "font-semibold",
          inputWrapper: `border-borderColor border-2 rounded-xl`,
        }}
        defaultValue={initialValue || ""}
      />
      {postToShare?.type === "BLOG_POST" && (
        <SharedBlogPostCard post={postToShare} isPreview={true} />
      )}
      {postToShare?.type === "CODE_DIARY" && (
        <SharedDiaryCard post={postToShare} isPreview={true} />
      )}
      <Button
        type="submit"
        color="secondary"
        className="rounded-lg font-semibold text-white"
        isLoading={isUpdating || isSharing}
      >
        {isEditing ? "Update" : `Share to ${guildName}`}
      </Button>
    </form>
  );
}
