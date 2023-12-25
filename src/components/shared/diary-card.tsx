"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import PostActions from "../ui/post-actions";
import { Avatar } from "@nextui-org/react";
import truncateString from "@/utils/truncateString";
import PostContextMenu from "../ui/post-context-menu";

interface IDiaryCard {
  post: TPost;
}

export default function DiaryCard({ post }: IDiaryCard) {
  return (
    <div 
      className="border-2 p-4 border-borderColor 
      h-[400px] w-[350px] rounded-3xl shadow-xl bg-cardBg 
      flex flex-col gap-2 justify-between"
    >
      <div className="grid gap-2">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Avatar
                src={post.author?.image as string}
                className="h-[40px] w-[40px]"
            />
            <div>
              <p className="text-sm font-semibold">{post.author?.name}</p>
              <p className="text-[.7rem] text-[#878080]">Yesterday</p>
            </div>
          </div>
          <PostContextMenu post={post} />
        </div>
        <h1 className="font-bold text-sm">{truncateString(post.diary?.title ?? "", 100)}</h1> 
      </div>

      <div className="grid gap-1">
        <SyntaxHighlighter
          language="jsx"
          style={dracula}
          showLineNumbers
          customStyle={{ fontSize: ".6rem", overflow: "auto", borderRadius: ".75rem", height: "200px"}}
        >
          {post.diary?.codeSnippet as string}
        </SyntaxHighlighter>
        <PostActions />
      </div>
    </div>
  );
}
