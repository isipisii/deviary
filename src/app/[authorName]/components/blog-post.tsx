/* eslint-disable @next/next/no-img-element */

import MarkdownPreview from "./markdown-preview";
import formatDate from "@/utils/formatDate";
import readingTime from "reading-time";
import PostAside from "./post-aside";
import PostTags from "./post-tags";

export default function BlogPost({ post }: { post: TPost }) {
  const { text: estimatedReadingTime } = readingTime(
    post.blog?.content as string,
  );

  return (
    <section className="mt-20 flex w-full items-center justify-center sm:mt-[3.5rem] ">
      <div
        className="flex w-full max-w-[1500px] flex-col-reverse 
          justify-center p-0 md:p-4 lg:flex-row"
      >
        {/* LEFT */}
        <div className="order-1 flex w-full flex-col gap-4 lg:order-none lg:max-w-[800px]">
          <div className="w-full px-[20px]">
            <img
              src={post.blog?.thumbnail?.imageUrl as string}
              alt="thumbnail"
              className="h-[200px] w-full rounded-3xl object-cover md:h-[400px]"
            />
          </div>

          <div className="w-full">
            <div className="flex flex-col gap-4 px-[20px]">
              <div className="space-y-3">
                <h1 className="text-[2rem] font-bold md:text-[2.5rem]">
                  {post.blog?.title}
                </h1>
                <p className="text-sm text-navTextColor">
                  {formatDate(post.createdAt)} • {estimatedReadingTime}
                </p>
              </div>
              <PostTags tags={post.tags} />
            </div>
            <MarkdownPreview modelValue={post.blog?.content as string} />
          </div>
        </div>

        {/* RIGHT */}
        <PostAside post={post} />
      </div>
    </section>
  );
}
