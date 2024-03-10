/* eslint-disable @next/next/no-img-element */
import PostActions from "@/components/shared/post-actions";
import SyntaxHighlighter from "@/components/shared/syntax-highlighter";
import PostContextMenu from "@/components/ui/post-context-menu";
import estimateReadingTime from "@/utils/estimateReadingTime";
import formatDate from "@/utils/formatDate";
import { Avatar, Image, User } from "@nextui-org/react";
import React from "react";
import GuildSharedCardContextMenu from "./guild-shared-card-context-menu";
import { useSession } from "next-auth/react";

export default function GuildSharedPostCard({
  sharedPost,
}: {
  sharedPost: TGuildSharedPost;
}) {
  const {
    user: { image, name },
    post,
    createdAt,
  } = sharedPost;
  const { data } = useSession();

  return (
    <div
      className="flex h-auto w-full max-w-[350px] flex-col 
      items-start gap-3 rounded-3xl border-2
      border-borderColor bg-cardBg p-4 shadow-xl"
    >
      <div className="flex w-full justify-between">
        <div className="relative">
          <User
            avatarProps={{
              src: image,
              isBordered: true,
            }}
            classNames={{
              description: "text-navTextColor",
              name: "font-medium",
            }}
            className="transition-transform"
            name={name}
            description={formatDate(createdAt)}
          />
          <Avatar
            src={sharedPost.guild.image.imageUrl}
            isBordered
            className="absolute -bottom-1 left-5 h-[25px] w-[25px] "
          />
        </div>
        {/* render if the shared post is from the authenticated user */}
        {data?.user.id === sharedPost.userId && (
          <GuildSharedCardContextMenu
            guildId={sharedPost.guildId}
            sharedPost={sharedPost}
          />
        )}
      </div>
      {sharedPost.content && (
        // <div className="max-h-[50px] overflow-hidden">
        <p className="w-full whitespace-pre-wrap break-words text-sm">
          {sharedPost.content}
        </p>
        // </div>
      )}

      {post.type === "BLOG_POST" && <SharedBlogPostCard post={post} />}
      {post.type === "CODE_DIARY" && <SharedDiaryCard post={post} />}
      <PostActions post={post} />
    </div>
  );
}

export function SharedBlogPostCard({
  post,
  isPreview,
}: {
  post: TPost;
  isPreview?: boolean;
}) {
  const { thumbnail, content, title } = post?.blog as TBlog;
  const { name, image } = post.author as TUser;

  return (
    <div className="h-[350px] w-full rounded-2xl border-2 border-borderColor">
      <div className="relative h-full w-full">
        {/* image and bg gradient */}
        <Image
          isBlurred
          src={thumbnail?.imageUrl}
          alt="thumbnail"
          removeWrapper
          className="absolute left-0 top-0 z-[5] h-full w-full rounded-3xl object-cover"
        />
        <div
          className="absolute bottom-0 left-0 z-[6] h-full w-full rounded-2xl bg-gradient-to-t from-[#0C1319]
              via-[#0c1319c8] to-[#24253300]"
        />
        {/* blog details */}
        <div className="absolute bottom-4 left-1/2 z-[6] flex w-[90%] -translate-x-1/2 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <Avatar src={image} className="w-[40px h-[40px]" isBordered />
              {!isPreview && (
                <PostContextMenu
                  className="bg-background"
                  postType="BLOG_POST"
                  post={post}
                />
              )}
            </div>
            <h3 className="mt-1 line-clamp-2 w-full text-[1.1rem] font-bold text-white shadow-lg">
              {title}
            </h3>
          </div>
          <div>
            <p className="text-[.8rem] text-[#A1A1AA]">
              {formatDate(post.createdAt)} • {estimateReadingTime(content)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SharedDiaryCard({
  post,
  isPreview,
}: {
  post: TPost;
  isPreview?: boolean;
}) {
  const { title, codeSnippet } = post.diary as TDiary;
  const { name, image } = post.author as TUser;

  return (
    <div className="h-[350px] w-full rounded-2xl border-2 border-borderColor p-4">
      <div className="grid gap-3">
        <div className="flex justify-between">
          <User
            avatarProps={{
              src: image,
              isBordered: true,
              className: "h-[35px] w-[35px]",
            }}
            classNames={{
              description: "text-navTextColor text-xs",
              name: "font-medium text-sm",
            }}
            className="transition-transform"
            name={name}
            description={formatDate(post.createdAt)}
          />
          {!isPreview && <PostContextMenu post={post} />}
        </div>
        <h1 className="line-clamp-3 text-sm font-bold">{title}</h1>
        <SyntaxHighlighter>{codeSnippet}</SyntaxHighlighter>
      </div>
    </div>
  );
}
