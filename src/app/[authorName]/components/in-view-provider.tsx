"use client";

import { ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useCreateReadingHistory } from "@/lib/services/reading-history.api";
import { useParams } from "next/navigation";

export default function InViewProvider({ children }: { children: ReactNode }) {
  const { postTitle } = useParams<{ postTitle: string }>()
  const postId = postTitle.split("-").at(-1)

  const { ref, inView } = useInView({ threshold: 0, triggerOnce: true });
  const { mutate: createReadingHistoryMutation } = useCreateReadingHistory()

  useEffect(() => {
    if (inView) {
      createReadingHistoryMutation(postId as string)
    }
  }, [inView, postId, createReadingHistoryMutation]);

  return (
    <div className="flex flex-col w-full">
      {children}
      {/* to track if the user reached the bottom */}
      <div ref={ref} />
    </div>
  );
}
