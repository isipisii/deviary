"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useGetPostComments } from "@/lib/services/comments.api";
import { FaRegComment } from "react-icons/fa6";
import CommentCard from "./comment-card";
import CommentSkeleton from "@/components/skeleton-loaders/comment-skeleton";

export default function CommentList({
  isCreatingComment,
  postId,
}: {
  isCreatingComment?: boolean;
  postId: string;
}) {
  const { inView, ref } = useInView();
  const { fetchNextPage, hasNextPage, isFetchingNextPage, data, isLoading } =
    useGetPostComments(postId);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-borderColor p-4">
      <h3 className="text-xl font-bold">Comments</h3>
      <div className="max-h-[350px] overflow-auto">
        <div className="flex flex-col gap-4 ">
          {data?.pages.map(
            (page) =>
              page.data?.map((comment, index) =>
                index + 1 === page.data.length ? (
                  <div ref={ref} key={comment.id}>
                    <CommentCard comment={comment} />
                  </div>
                ) : (
                  <CommentCard key={comment.id} comment={comment} />
                ),
              ),
          )}
          {isFetchingNextPage && <CommentListSkeleton />}
          {isLoading && <CommentListSkeleton />}

          {/*this is the shape of pages if its empty: Array [ [] ], so in order to 
          check if theres no comment is to check if its 1st element is an array 
          since it should be a page object*/}
          {Array.isArray(data?.pages[0]) && (
            <div className="flex h-[350px] w-full items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <p className="text-[2.5rem] text-navTextColor">
                  <FaRegComment />
                </p>
                <div>
                  <h3 className="text-center text-[.9rem] font-semibold text-navTextColor md:text-xl">
                    No comments.
                  </h3>
                  <p className="text-center text-xs text-navTextColor md:text-sm">
                    Be the first one to comment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentListSkeleton() {
  return (
    <>
      {[...new Array(3)].map((_, index) => (
        <CommentSkeleton key={index} />
      ))}
    </>
  );
}
