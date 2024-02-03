"use client";

import { useState } from "react";
import PostActions from "@/components/shared/post-actions";
import PostContextMenu from "@/components/ui/post-context-menu";
import { Textarea, User, Button } from "@nextui-org/react";
import CommentList from "./comment/comment-list";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const commentSchema = z.object({
  content: z.string().min(1, { message: "Title is required" }),
});

type TCommentSchema = z.infer<typeof commentSchema>;

export default function PostAside({ post }: { post: TPost }) {
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const { data } = useSession();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TCommentSchema>({
    resolver: zodResolver(commentSchema),
  });

  function toggleOpenCommentForm() {
    setIsCommentFormOpen(prevState => !prevState);
  }

  function handleSubmitCommentMutation(formData: TCommentSchema) {
    // todo
  }

  return (
    <div className="w-full p-[20px] md:py-4 lg:max-w-[500px] lg:p-0">
      <div className="order-last flex flex-col gap-4 md:sticky md:top-[5.5rem] md:m-0">
        <div
          className=" flex 
            h-[150px] w-full flex-col justify-between
            rounded-3xl border border-borderColor p-4"
        >
          <div className="flex justify-between">
            <User
              as="button"
              avatarProps={{
                src: post.author.image ?? "",
              }}
              className="self-start transition-transform"
              description={post.author.email}
              name={post.author.name}
            />
            <PostContextMenu
              post={post}
              className="border-[1px] border-borderColor bg-background"
            />
          </div>
          <PostActions
            post={post}
            isInPostPage={true}
            isCommentFormOpen={isCommentFormOpen}
            toggleOpenCommentForm={toggleOpenCommentForm}
          />
        </div>

        {/* comment form */}
        {isCommentFormOpen && (
          <form
            className="flex flex-col gap-4 rounded-3xl 
            border border-borderColor bg-background p-4"
            onSubmit={handleSubmit(handleSubmitCommentMutation)}
          >
            <User
              as="button"
              avatarProps={{
                src: data?.user.image ?? "",
              }}
              className="self-start transition-transform"
              description={data?.user.email}
              name={data?.user.name}
            />
            <Textarea
              labelPlacement="inside"
              label="Write your comment"
              radius="lg"
              maxRows={20}
              variant="bordered"
              classNames={{
                label: "font-semibold",
                inputWrapper: " border-borderColor border-2 rounded-2xl",
              }}
              {...register("content")}
              errorMessage={errors.content?.message}
              isInvalid={!!errors.content}
            />
            <Button
              color="secondary"
              className="text-semibold self-end rounded-xl text-white"
              isDisabled={!!!watch("content")}
            >
              Comment
            </Button>
          </form>
        )}
        {/* comments */}
        <CommentList />
      </div>
    </div>
  );
}
