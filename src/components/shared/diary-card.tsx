"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import PostActions from "../ui/post-actions";
import { Avatar } from "@nextui-org/react";

interface IDiaryCard {
  post: TPost;
}

export default function DiaryCard({ post }: IDiaryCard) {
  return (
    <div className="border-2 p-4 border-borderColor h-[400px] w-[330px] rounded-3xl shadow-xl bg-[#0f131d] grid gap-3">

      <div className="grid gap-3">
        <div className="flex gap-2">
          <Avatar
              src={post.author?.image as string}
              className="h-[40px] w-[40px]"
          />
          <div>
            <p className="text-sm font-semibold">{post.author?.name}</p>
            <p className="text-xs text-[#878080]">{post.author?.email}</p>
          </div>
        </div>
        <h1 className="font-bold text-lg">{post.diary?.title}</h1> 
      </div>

      <div className="grid">
        <SyntaxHighlighter
          language="jsx"
          style={dracula}
          showLineNumbers
          customStyle={{ fontSize: ".6rem", overflow: "auto", borderRadius: ".75rem", height: "220px"}}
          
        >
          {post.diary?.codeSnippet as string}
        </SyntaxHighlighter>
        <PostActions />
      </div>
    </div>
  );
}
