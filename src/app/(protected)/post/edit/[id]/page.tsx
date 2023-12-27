import { db } from "@/lib/prisma";
import BlogPostForm from "../../components/blog-post-form";
import DiaryForm from "../../components/diary-form";

export default async function EditPost({ params }: { params: { id: string } }) {
  const postToEdit = (await db.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      blog: true,
      diary: true,
    },
  })) as TPost;

  return (
    <div className="p-6 md:p-12 w-full flex items-center justify-center">
      <div className="flex justify-between max-w-[900px] w-full flex-col item gap-6">
        <h2 className="font-semibold text-3xl">
          Edit {" "}
          <span className="text-secondary">
            {postToEdit?.type === "BLOG_POST" ? "blog" : "diary"}
          </span>
        </h2>
        {postToEdit?.type === "BLOG_POST" ? (
          <BlogPostForm postToEdit={postToEdit} />
        ) : (
          <DiaryForm postToEdit={postToEdit} />
        )}
      </div>
    </div>
  );
}
