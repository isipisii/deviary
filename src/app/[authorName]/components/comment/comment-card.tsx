import { User } from "@nextui-org/react";
import React from "react";

export default function CommentCard({ comment }: { comment: TComment }) {
    
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
            className: "h-[35px] w-[35px]"
          }}
          className="self-start transition-transform"
          name={comment.user.name}
          description={comment?.user.email}
        />
        {/* <PostContextMenu
                      post={post}
                      className="border-[1px] border-borderColor bg-background"
                    /> */}
      </div>
      {/* comment */}
      <p className="text-sm">
        {comment.content}
      </p>
      {/* <PostActions post={post} isInPostPage={true} /> */}
    </div>
  );
}
