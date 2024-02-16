import { Skeleton } from "@nextui-org/react";

export default function GuildCardsSkeleton() {
  return (
    <>
      {[...new Array(5)].map((_, index) => (
        <div
          className="relative flex h-[400px] w-full max-w-[350px] items-end justify-center overflow-hidden rounded-3xl border-2 border-borderColor bg-cardBg p-4 shadow-xl"
          key={index}
        >
          {/* card details */}
          <div className="z-[5] flex h-full w-full flex-col justify-between gap-4">
            <div className="flex w-full flex-col">
              <div className="flex self-end">
                {[...new Array(4)].map((_, index) => (
                  <Skeleton
                    className={`${
                      index === 0 ? "ml-0" : "-ml-[.8rem]"
                    }  h-[2rem] w-[2rem] rounded-full border border-background`}
                    key={index}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-[80px] w-[80px] rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-[1.25rem] w-[80px] rounded-xl" />
                  <Skeleton className="h-[.875rem] w-[70px] rounded-xl" />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-1">
                <Skeleton className="h-[.875rem] w-full rounded-xl" />
                <Skeleton className="h-[.875rem] w-full rounded-xl" />
                <Skeleton className="h-[.875rem] w-1/2 rounded-xl" />
              </div>
            </div>
            <Skeleton className="h-[2.5rem] w-full rounded-xl" />
          </div>
        </div>
      ))}
    </>
  );
}
