import { db } from "@/lib/prisma";
import BlogPostForm from "../../components/blog-post-form";
import DiaryForm from "../../components/diary-form";
import PageTitle from "@/components/ui/page-title";
import { unstable_noStore as noStore } from "next/cache";

export default async function EditPost({ params }: { params: { id: string } }) {
  //to remove caching
  noStore();

  const postToEdit = await db.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      blog: true,
      diary: true,
    },
  }) as Partial<TPost>
  
  return (
    <div className="p-6 md:p-12 w-full flex items-center justify-center">
      <div className="flex justify-between max-w-[900px] w-full flex-col item gap-6">
        <PageTitle>
          Edit{" "}
          <span className="text-secondary">
            {postToEdit?.type === "BLOG_POST" ? "blog" : "diary"}
          </span>
        </PageTitle>
        {postToEdit?.type === "BLOG_POST" ? (
          <BlogPostForm postToEdit={postToEdit} />
        ) : (
          <DiaryForm postToEdit={postToEdit} />
        )}
      </div>
    </div>
  );
}