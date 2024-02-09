import TopNav from "@/components/layout/top-nav";
import BlogPost from "../components/blog-post";
import { getPostById } from "@/lib/actions";
import { getServerSideSession } from "@/lib/auth";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { QueryKeys } from "@/lib/constants";
import { getPostComments } from "@/lib/services/comments.api";
import DiaryPost from "../components/diary-post";

export default async function PostPage({
  params,
}: {
  params: { authorName: string; postTitle: string };
}) {
  const queryClient = new QueryClient();
  const session = await getServerSideSession();
  const postId = params.postTitle.split("-").at(-1) as string;
  const post = await getPostById(postId, session?.user.id as string);

  await queryClient.prefetchInfiniteQuery({
    queryKey: [QueryKeys.Comments, postId],
    initialPageParam: "",
    queryFn: ({ pageParam: lastCursor }) => getPostComments(5, lastCursor, postId),
    getNextPageParam: (lastPage: TPage<TComment[]>) =>
      lastPage.metaData ? lastPage?.metaData.lastCursor : null,
    pages: 3,
  });

  return (
    <>
      <TopNav />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="relative mt-[73px] flex items-center justify-center">
          {post?.type === "BLOG_POST" && <BlogPost post={post} />}
          {post?.type === "CODE_DIARY" && <DiaryPost post={post} />}
        </div>
      </HydrationBoundary>
    </>
  );
}
