/* eslint-disable @next/next/no-img-element */
"use client";

import { Button, Chip } from "@nextui-org/react";
import MarkdownPreview from "./markdown-preview";
import { useRouter } from "next/navigation";
import { HiMiniArrowLongLeft } from "react-icons/hi2";
import formatDate from "@/utils/formatDate";
import readingTime from "reading-time";
import PostAside from "./post-aside";

export default function BlogPost({ post }: { post: TPost }) {
  const router = useRouter();
  const { text: estimatedReadingTime } = readingTime(
    post.blog?.content as string,
  );

  return (
    <>
      <Button
        variant="light"
        size="md"
        onClick={() => router.back()}
        className="absolute left-5 top-5 rounded-xl text-sm font-semibold md:text-base"
        isIconOnly
      >
        <HiMiniArrowLongLeft className="text-[1.5rem] md:text-[2rem]" />
      </Button>

      <div className="mt-20 flex w-full items-center justify-center sm:mt-[3.5rem] ">
        <div
          className="flex w-full max-w-[1500px] flex-col-reverse 
          justify-center p-0 md:p-4 lg:flex-row"
        >
          {/* RIGHT */}
          <div className="order-1 flex w-full flex-col gap-4 lg:order-none lg:max-w-[800px]">
            <div className="w-full px-[20px]">
              <img
                src={post.blog?.thumbnail?.imageUrl as string}
                alt="thumbnail"
                className="h-[200px] w-full object-cover md:h-[400px] rounded-3xl"
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
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Chip
                      radius="full"
                      size="md"
                      color="secondary"
                      variant="flat"
                      classNames={{
                        base: "border-none font-semibold",
                      }}
                      key={index}
                    >
                      #{tag}
                    </Chip>
                  ))}
                </div>
              </div>
              <MarkdownPreview modelValue={post.blog?.content as string} />
            </div>
          </div>
                      
          {/* LEFT */}
          <PostAside post={post} />
        </div>
      </div>
    </>
  );
}
