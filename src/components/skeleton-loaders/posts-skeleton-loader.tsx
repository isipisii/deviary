"use client"

import useDetectViewport from "@/lib/hooks/useDetectViewport";
import PostSkeleton from "./post-skeleton";
import { useState } from "react";

export default function PostsSkeletonLoader({ isInInfinite = true }: { isInInfinite?: boolean }) {
  // const { isInRange } = useDetectViewport('sm')
  // const [arraySize] = useState(isInRange ? 4 : 8)

  return (
    <>
      {[...new Array(8)].map((_, index) => {
          return (
            <PostSkeleton key={"key" + index}/>
          );
      })}
    </>
  );
}
