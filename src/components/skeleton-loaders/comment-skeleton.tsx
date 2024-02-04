import { Skeleton } from "@nextui-org/react";

export default function CommentSkeleton() {
  return (
    <div
      className="flex h-auto 
    w-full flex-col justify-between gap-4
    rounded-2xl border border-borderColor p-4"
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[35px] w-[35px] rounded-full" />
          <div className="space- y-1">
            <Skeleton className="h-[.75rem] w-[100px] rounded-full" />
            <Skeleton className="h-[.7rem] w-[90px] rounded-full" />
          </div>
        </div>
      </div>
      {/* comment */}
      <div className="space-y-2">
        <Skeleton className="h-[.7rem] w-full rounded-full" />
        <Skeleton className="h-[.7rem] w-[80%] rounded-full" />
      </div>
      {/* <PostActions post={post} isInPostPage={true} /> */}
    </div>
  );
}
