import { User } from "@nextui-org/react";
import React from "react";

export default function CommentCard({ comment }: { comment?: TComment }) {
    
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
            src: "",
          }}
          className="self-start transition-transform"
          description="alebenig4@gmail.com"
          name="Alessandro Benig"
        />
        {/* <PostContextMenu
                      post={post}
                      className="border-[1px] border-borderColor bg-background"
                    /> */}
      </div>
      {/* comment */}
      <p className="text-sm">
        adsadwasdwasdwasdw flex-col gap flex-col gap flex-col gap flex-col gap
        flex-col gap
      </p>
      {/* <PostActions post={post} isInPostPage={true} /> */}
    </div>
  );
}
