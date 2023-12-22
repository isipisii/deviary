import { Skeleton } from "@nextui-org/react";

export default function PostsSkeletonLoader() {
  return (
    <>
      {[...new Array(6)].map((_, index) => {
        // if (index % 2 === 0) {
          return (
            <div
              className="border-2 p-4 border-borderColor h-[400px] w-[330px] rounded-3xl shadow-xl bg-[#0f131d] grid gap-3"
              key={index}
            >
              <div className="grid gap-3">
                <div className="flex gap-2 items-center">
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
                {/* <PostActions /> */}
                <Skeleton className="h-[2rem] w-full rounded-lg" />
              </div>
            </div>
          );
        // }
      })}
    </>
  );
}
