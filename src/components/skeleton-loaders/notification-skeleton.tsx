import { Skeleton } from "@nextui-org/react";
import React from "react";

export default function NotificationSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="h-[45px] w-[45px] rounded-full" />
      <div className="flex w-[90%] flex-col gap-3">
        <Skeleton className="h-[.9rem] w-[50%] rounded-lg" />
        <div className="flex items-center gap-2 rounded-lg border border-borderColor p-3">
          <Skeleton className="h-[50px] w-[90px] rounded-md" />
          <div className="flex w-[90%] flex-col gap-2">
            <Skeleton className="h-[.875rem] w-[70%] rounded-lg" />
            <Skeleton className="h-[.875rem] w-[30%] rounded-lg" />
          </div>
        </div>
        <Skeleton className="] h-[0.75rem] w-[10%] self-end rounded-lg" />
      </div>
    </div>
  );
}
