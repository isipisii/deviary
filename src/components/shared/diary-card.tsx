import PostActions from "./post-actions";
import { Avatar } from "@nextui-org/react";
import PostContextMenu from "../ui/post-context-menu";
import formatDate from "@/utils/formatDate";
import formatPostHref from "@/utils/formatPostHref";
import Link from "next/link";
import SyntaxHighlighter from "./syntax-highlighter";

interface IDiaryCard {
  post: TPost;
}

export default function DiaryCard({ post }: IDiaryCard) {
  return (
    <Link href={formatPostHref(post)} className=" w-full max-w-[350px]">
      <div
        className="flex h-[400px] w-full
        flex-col justify-between gap-2 rounded-3xl border-2 
        border-borderColor bg-cardBg p-4 shadow-xl"
      >
        <div className="grid gap-3">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                src={post.author?.image as string}
                className="h-[40px] w-[40px]"
                isBordered
              />
              <div>
                <p className="text-sm font-semibold">{post.author?.name}</p>
                <p className="text-[.7rem] text-[#878080]">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
            <PostContextMenu post={post} />
          </div>
          <h1 className="line-clamp-3 text-sm font-bold">
            {post.diary?.title}
          </h1>
        </div>

        <div className="grid gap-1">
          <SyntaxHighlighter>
            {post.diary?.codeSnippet as string}
          </SyntaxHighlighter>
          <PostActions post={post} />
        </div>
      </div>
    </Link>
  );
}
