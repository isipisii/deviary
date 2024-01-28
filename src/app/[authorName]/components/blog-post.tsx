/* eslint-disable @next/next/no-img-element */
"use client";

import { Button, Chip, User } from "@nextui-org/react";
import MarkdownPreview from "./markdown-preview";
import { useRouter } from "next-nprogress-bar";
import { HiMiniArrowLongLeft } from "react-icons/hi2";
import PostActions from "@/components/shared/post-actions";
import PostContextMenu from "@/components/ui/post-context-menu";
import formatDate from "@/utils/formatDate";
import readingTime from "reading-time";

export default function BlogPost({ post }: { post: TPost }) {
  const router = useRouter();
  const { text: estimatedReadingTime } = readingTime(post.blog?.content as string)

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
          justify-center gap-4 p-0 lg:flex-row md:p-4"
        >
          
          {/* RIGHT */}
          <div className="flex w-full lg:max-w-[700px] flex-col gap-4 lg:order-none order-1">
            <img
              src={post.blog?.thumbnail?.imageUrl as string}
              alt="thumbnail"
              className="h-[200px] w-full object-cover px-[20px] md:h-[400px]"
            />
    
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
                <div className="flex gap-2 flex-wrap">
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
          <div className="p-[20px] md:p-0 w-full lg:max-w-[400px] ">
            <div
              className=" flex h-[150px] 
              w-full flex-col justify-between rounded-2xl
              border border-borderColor p-4 md:sticky md:top-[5.5rem] md:m-0 order-last"
            > 
              <div className="flex justify-between">
                <User
                  as="button"
                  avatarProps={{
                    src: post.author.image ?? "",
                  }}
                  className="self-start transition-transform"
                  description={post.author.email}
                  name={post.author.name}
                />
                <PostContextMenu 
                  post={post} 
                  className="bg-background border-[1px] border-borderColor" 
                />
              </div>
              <PostActions post={post} />
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
