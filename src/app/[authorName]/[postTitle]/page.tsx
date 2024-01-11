import TopNav from "@/components/layout/top-nav";
import BlogPost from "../components/blog-post";
import { getPostById } from "@/lib/actions";

export default async function PostPage({
  params,
}: {
  params: { authorName: string; postTitle: string };
}) {
  const postId = params.postTitle.split("-").at(-1) as string;
  const post = await getPostById(postId)

  return (
    <>
      <TopNav />
      <div className="relative mt-[73px] flex items-center justify-center">
        {post?.type === "BLOG_POST" ? <BlogPost post={post} /> : null}
      </div>
    </>
  );
}
