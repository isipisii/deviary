"use client"
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
  } from "@nextui-org/react";
import { GoKebabHorizontal } from "react-icons/go";
import { cn } from "@/utils/cn";
import { useSession } from "next-auth/react";
import { postContextMenuItems } from "@/lib/constants";
import { useDeletePost } from "@/lib/services/post.api";

interface IPostContextMenu {
    postType?: "BLOG_POST" | "CODE_DIARY"
    className?: string
    post: TPost
}

export default function PostContextMenu({ post, postType, className }: IPostContextMenu) {
  const { data } = useSession()
  const items = data?.user.id === post.authorId ? postContextMenuItems : postContextMenuItems.filter(item => item.key !== "edit" && item.key !== "delete" )
  const { mutate: deletePostMutation, isPending } = useDeletePost()
    console.log(isPending)
    
  return (
    <Dropdown 
        className={cn(
            "bg-cardBg",
            className 
        )} 
        placement="bottom-end"
    >
        <DropdownTrigger>
            <Button
                variant="light"
                size="sm"
                isIconOnly
                // className="rounded-lg text-[1.2rem]"
                className={cn("rounded-lg text-[1.2rem]", {"text-white" : postType === "BLOG_POST"})}
                startContent={<GoKebabHorizontal />}
            />
        </DropdownTrigger>
        <DropdownMenu aria-label="Dynamic Actions" items={items} variant="flat">
            {(item => (
                <DropdownItem 
                    key={item.key}
                    color={item.key === "delete" ? "danger" : undefined}
                    className={item.key === "delete" ? "text-danger" : ""}
                    onClick={() => deletePostMutation(post.id)}
                >
                    {item.label}
                </DropdownItem>
            ))}
        </DropdownMenu>
    </Dropdown>
  )
}
