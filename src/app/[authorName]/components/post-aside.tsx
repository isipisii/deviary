"use client";

import { useState } from "react";
import PostActions from "@/components/shared/post-actions";
import PostContextMenu from "@/components/ui/post-context-menu";
import { User} from "@nextui-org/react";
import CommentList from "./comment/comment-list";
import { useSession } from "next-auth/react";
import CommentForm from "./comment/comment-form";

export default function PostAside({ post }: { post: TPost }) {
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const { data } = useSession();

  function toggleOpenCommentForm() {
    setIsCommentFormOpen((prevState) => !prevState);
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
              classNames={{
                description: "text-navTextColor",
                name: "font-medium",
              }}
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
          <CommentForm
            isEditing={false}
            textAreaProps={{
              labelPlacement: "inside",
              label: "Write your comment",
              radius: "lg",
              minRows: 3,
              maxRows: 20,
            }}
            postId={post.id}
          />
        )}
        {/* comments */}
        <CommentList postId={post.id} />
      </div>
    </div>
  );
}
