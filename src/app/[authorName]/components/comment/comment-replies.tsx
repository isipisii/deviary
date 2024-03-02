import React from "react";
import CommentCard from "./comment-card";

export default function CommentReplies({ commentReplies, postAuthorId }: { commentReplies: TComment[], postAuthorId: string }) {
  return (
    <div className="flex gap-4 flex-col pl-4">
      {commentReplies.map((commentReply, index)=> (
        <CommentCard key={index} comment={commentReply} postAuthorId={postAuthorId} isReply={true} />
      ))}
    </div>
  )
}
