"use client";

import { Button, Chip } from "@nextui-org/react";
import MarkdownPreview from "./markdown-preview";
import { useRouter } from "next-nprogress-bar";

export default function BlogPost({ post }: { post: TPost }) {
  const router = useRouter();

  return (
    <>
      <Button
        variant="light"
        size="md"
        radius="lg"
        onClick={() => router.push("/feed")}
        className="absolute left-5 top-5"
      >
        Go to feed
      </Button>

      <div className="mt-10 flex w-full max-w-[1200px] flex-col gap-4 p-4">
        <img
          src={post.blog?.thumbnail?.imageUrl as string}
          alt="thumbnail"
          className="h-[180px] w-full rounded-tl-2xl rounded-tr-2xl object-cover md:h-[300px]"
        />

        <div className="w-full">
          <div className="flex flex-col gap-4">
            <h1 className="text-[2rem] font-bold md:text-[2.5rem]">
              {post.blog?.title}
            </h1>
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
    </>
  );
}