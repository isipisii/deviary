"use client";

import { useState } from "react";
import PostActions from "@/components/shared/post-actions";
import PostContextMenu from "@/components/ui/post-context-menu";
import { User} from "@nextui-org/react";
import CommentList from "./comment/comment-list";
import { useSession } from "next-auth/react";
import CommentForm from "./comment/comment-form";
import { FaMedal } from "react-icons/fa";

export default function PostAside({ post }: { post: TPost }) {
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(true);
  const { data } = useSession();

  function toggleOpenCommentForm() {
    setIsCommentFormOpen((prevState) => !prevState);
  }

  return (
    <div className="w-full p-[20px] md:py-4 lg:max-w-[500px] lg:p-0">
      <div className="order-last flex flex-col gap-4 md:sticky md:top-[5.5rem] md:m-0">
        <div
          className=" flex 
          w-full flex-col justify-between
          rounded-3xl border border-borderColor p-4 gap-4"
        >
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <User
                as="button"
                avatarProps={{
                  src: post.author.image,
                  isBordered: true
                }}
                className="self-start transition-transform"
                classNames={{
                  description: "text-navTextColor",
                  name: "font-semibold",
                }}
                description={post.author.email}
                name={post.author.name}
              />
              <p className="text-md text-warning -mt-1"><FaMedal/></p>
            </div>
            <PostContextMenu
              post={post}
              className="border-[1px] border-borderColor bg-background"
            />
          </div>
          <p className="text-navTextColor">{post.author.bio}</p>
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
            textAreaProps={{
              placeholder: "Write your comment",
              radius: "lg",
              minRows: 3,
              maxRows: 20,
            }}
          />
        )}
        {/* comments */}
        <CommentList postId={post.id} />
      </div>
    </div>
  );
}
