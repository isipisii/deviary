import React from "react";
import CommentCard from "./comment-card";

export default function CommentReplies({ commentReplies }: { commentReplies: TComment[] }) {
  return (
    <div className="flex gap-4 flex-col">
        {commentReplies.map((commentReply, index)=> (
          <CommentCard key={index} comment={commentReply} />
        ))}
    </div>
  )
}
