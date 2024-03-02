import { Skeleton } from "@nextui-org/react";

export default function GuildDetailsSkeleton() {
  return (
    <div className="z-[5] grid h-auto w-full place-items-center gap-4 border-b border-borderColor bg-background/30 p-6 backdrop-blur-xl md:p-12 lg:place-items-start ">
      <Skeleton className="h-[120px] w-[120px] rounded-full md:h-[150px] md:w-[150px]" />

      <div className="guild-lower">
        <div className="grid place-items-center gap-4 lg:place-items-start">
          <div className="guild-details flex flex-col gap-4">
            <div className="guild-details-skeleton-container">
              <Skeleton className="h-[2rem] w-[10rem] rounded-2xl" />
              <Skeleton className="h-[1rem] w-[7rem] rounded-xl" />
            </div>
            <div className="guild-details-skeleton-container">
              <Skeleton className="h-[.9rem] w-[300px] rounded-xl" />
              <Skeleton className="h-[.9rem] w-[200px]  rounded-xl" />
            </div>
          </div>

          <div className="flex">
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
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-[2.5rem] w-[10rem] rounded-xl" />
          <Skeleton className="h-[2.5rem] w-[2.5rem] rounded-xl" />
          <Skeleton className="h-[2.5rem] w-[2.5rem] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
