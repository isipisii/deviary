"use client";

import { Button, Chip } from "@nextui-org/react";
import MarkdownPreview from "./markdown-preview";
import { useRouter } from "next-nprogress-bar";
import { LuChevronLeft } from "react-icons/lu";
import PostActions from "@/components/ui/post-actions";

export default function BlogPost({ post }: { post: TPost }) {
  const router = useRouter();

  return (
    <>
      <Button
        variant="light"
        size="md"
        onClick={() => router.push("/feed")}
        className="absolute left-5 top-5 text-sm md:text-base font-semibold rounded-xl"
        isIconOnly
      >
        <LuChevronLeft className="md:text-[1.7rem] text-[1.5rem]" />
      </Button>
      
      <div className="mt-20 md:mt-10 flex gap-4 w-full items-center justify-center">
        {/* <PostActions post={post} orientation="vertical" /> */}
        <div className="flex w-full max-w-[900px] flex-col gap-4">
          <img
            src={post.blog?.thumbnail?.imageUrl as string}
            alt="thumbnail"
            className="h-[180px] w-full rounded-tl-2xl rounded-tr-2xl object-cover md:h-[300px] px-[20px]"
          />

          <div className="w-full">
            <div className="flex flex-col gap-4 px-[20px]">
              <div>
                <h1 className="text-[2rem] font-bold md:text-[2.5rem]">
                  {post.blog?.title}
                </h1>
                <p className="text-navTextColor text-sm">{post.author.name}</p>
              </div>
              <div className="flex gap-2">
                {post.tags.map((tag, index) => (
                  <Chip
                    radius="full"
                    size="md"
                    color="secondary"
                    variant="flat"
                    classNames={{
                      base: "border-none",
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
        
        {/* <div className="border h-[200px] w-[200px]">
            
        </div> */}

      </div>
    </>
  );
}
