import TopNav from "@/components/layout/top-nav";
import axios from "axios";
import BlogPost from "../components/blog-post";

export default async function PostPage({
  params,
}: {
  params: { authorName: string; postTitle: string };
}) {
  const postId = params.postTitle.split("-").at(-1);
  const post = await getPost(postId as string);

  async function getPost(postId: string) {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/post/${postId}`,
      );

      return response.data.data as TPost;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <TopNav />
      <div className="relative mt-[73px] flex items-center justify-center">
        {post?.type === "BLOG_POST" ? <BlogPost post={post} /> : null}
      </div>
    </>
  );
}
