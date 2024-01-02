"use client"

import useDetectViewport from "@/lib/hooks/useDetectViewport";
import PostSkeleton from "./post-skeleton";
import { useState } from "react";

export default function PostsSkeletonLoader({ isInInfinite = true }: {isInInfinite?: boolean}) {
  const { isInViewport } = useDetectViewport('sm')
  const [arraySize] = useState(isInInfinite ? 4 : isInViewport ? 4 : 8)

  return (
    <>
      {[...new Array(arraySize)].map((_, index) => {
          return (
            <PostSkeleton key={"key" + index}/>
          );
      })}
    </>
  );
}
