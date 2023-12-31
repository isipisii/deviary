"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import PostActions from "../ui/post-actions";
import { Avatar } from "@nextui-org/react";
import PostContextMenu from "../ui/post-context-menu";

interface IDiaryCard {
  post: TPost;
}

export default function DiaryCard({ post }: IDiaryCard) {
  return (
    <div
      className="flex h-[400px] w-full max-w-[350px]
      flex-col justify-between gap-2 rounded-3xl border-2 
      border-borderColor bg-cardBg p-4 shadow-xl"
    >
      <div className="grid gap-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              src={post.author?.image as string}
              className="h-[40px] w-[40px]"
            />
            <div>
              <p className="text-sm font-semibold">{post.author?.name}</p>
              <p className="text-[.7rem] text-[#878080]">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <PostContextMenu post={post} />
        </div>
        <h1 className="line-clamp-3 text-sm font-bold">{post.diary?.title}</h1>
      </div>

      <div className="grid gap-1">
        <SyntaxHighlighter
          language="jsx"
          style={dracula}
          showLineNumbers
          customStyle={{
            fontSize: ".6rem",
            overflow: "auto",
            borderRadius: ".75rem",
            height: "200px",
          }}
        >
          {post.diary?.codeSnippet as string}
        </SyntaxHighlighter>
        <PostActions postId={post.id} />
      </div>
    </div>
  );
}
