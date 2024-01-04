import { ReactNode } from "react";
import { useSideBarNavStore } from "@/lib/store/useSideBarNavStore";
import { cn } from "@/utils/cn";

export default function CardContainer({ children }: { children: ReactNode }) {
  const { isSideBarMinimized } = useSideBarNavStore((state) => state);
  return (
    // <div className="flex-start mt-8 flex flex-wrap items-center justify-center gap-6">
    <div
      className={`mt-8 grid w-full grid-cols-1 place-items-center gap-8 ${
        !isSideBarMinimized
          ? "md:grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4"
          : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      } `}
    >
      {children}
    </div>
  );
}
