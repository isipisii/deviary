import { Skeleton } from "@nextui-org/react";

export default function PostSkeleton() {
  return (
    <div className="grid h-[400px] w-full max-w-[350px] gap-3 rounded-3xl border-2 border-borderColor bg-cardBg p-4 shadow-xl">
      <div className="grid gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[40px] w-[40px] rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-[0.875rem] w-[90px] rounded-md" />
            <Skeleton className="h-[0.75rem] w-[70px] rounded-md" />
          </div>
        </div>
        <Skeleton className="h-[1.25rem] w-[90%] rounded-lg" />
      </div>

      <div className="grid">
        <Skeleton className="h-[220px] w-full rounded-[.75rem]" />
        <Skeleton className="h-[2rem] w-full rounded-lg" />
      </div>
    </div>
  );
}
