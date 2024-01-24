import { Skeleton } from "@nextui-org/react";

export default function AccountSkeleton() {
  return (
    <div className="flex w-[200px] items-center gap-3">
      <div>
        <Skeleton className="flex h-10 w-10 rounded-full" />
      </div>
      <div className="flex w-full flex-col gap-1">
        <Skeleton className="h-3 w-full rounded-lg" />
        <Skeleton className="h-3 w-[60%] rounded-lg" />
      </div>
    </div>
  );
}
