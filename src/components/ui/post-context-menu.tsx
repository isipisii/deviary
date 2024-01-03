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
import { postContextMenuItems } from "@/lib/constants";
import { useDeletePost } from "@/lib/services/post.api";
import { useCreateBookmark, useRemoveBookmark } from "@/lib/services/bookmark.api";
import { useRouter } from "next-nprogress-bar";
import { useDisclosure } from "@nextui-org/react";
import DeletePostModal from "./delete-modal";
import { useSession } from "next-auth/react";

interface IPostContextMenu {
    postType?: "BLOG_POST" | "CODE_DIARY"
    className?: string
    post: TPost
}

export default function PostContextMenu({ post, postType, className }: IPostContextMenu) {
  const { data, update} = useSession()
  const bookmarks = data?.user.bookmarks as { id: string, postId: string;}[]
  const router = useRouter()
  const items = data?.user.id === post.authorId ? postContextMenuItems : postContextMenuItems.filter(item => item.key !== "edit" && item.key !== "delete" )
  //for delete modal
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const { mutate: deletePostMutation, isPending } = useDeletePost(onClose)
  const { 
    mutate: createBookmarkMutation, 
    isPending: isAddingBookmark 
  } = useCreateBookmark()
  const { 
    mutate: removeBookmarkMutation, 
    isPending: isRemovingBookmark 
  } = useRemoveBookmark()

  function handleDeletePost(){
    deletePostMutation(post.id)
  }

  function handleToggleBookmark() {
    if(post.isBookmarked) {
        if(post.bookmarkId) removeBookmarkMutation({bookmarkId: post.bookmarkId, postId: post.id})
    } else {
        createBookmarkMutation(post.id)
    }
  } 

  return (
    <>  
        <DeletePostModal
            isOpen={isOpen} 
            onOpenChange={onOpenChange} 
            handleDelete={handleDeletePost}
            isDeleting={isPending}
        />
        <Dropdown 
            className={cn(
                "bg-cardBg rounded-xl",
                className 
            )} 
            placement="bottom-end"
        >
            <DropdownTrigger onClick={(e) => e.preventDefault()}>
                <Button
                    variant="light"
                    size="sm"
                    isIconOnly
                    className={cn("rounded-lg text-[1.2rem]", {"text-white" : postType === "BLOG_POST"})}
                    startContent={<GoKebabHorizontal />}
                />
            </DropdownTrigger>
            <DropdownMenu 
                aria-label="Dynamic Actions" 
                items={items} 
                variant="flat" 
                // disabledKeys={isAddingBookmark || isRemovingBookmark ? ["bookmark"] : undefined}
            >
                {((item) => {
                    if(item.key === "edit") {
                        return (
                            <DropdownItem 
                                key={item.key}
                                onClick={() => router.push(`/post/edit/${post.id}`)}
                                startContent={<item.icon />}
                                className="rounded-lg"
                            >
                                {item.label}
                            </DropdownItem>
                        )
                    }

                    if(item.key === "delete") {
                        return ( 
                            <DropdownItem 
                                key={item.key}
                                color="danger"
                                className="text-danger rounded-lg"
                                startContent={<item.icon />}
                                onPress={onOpen}
                            >
                                {item.label}
                            </DropdownItem>
                        )
                    }

                    if(item.key === "bookmark") {
                        return ( 
                            <DropdownItem 
                                key={item.key}
                                color="warning"
                                className={`rounded-lg ${post.isBookmarked ? "text-warning" : null}`}
                                startContent={post.isBookmarked ? <item.activeIcon /> : <item.icon />}
                                onClick={handleToggleBookmark}
                            >
                                {post.isBookmarked ? "Bookmarked" : item.label}
                            </DropdownItem>
                        )
                    }

                    return (
                        <DropdownItem 
                            key={item.key}
                            startContent={<item.icon />}
                            className="rounded-lg"
                        >
                            {item.label}
                        </DropdownItem>
                    )
                })}
            </DropdownMenu>
        </Dropdown>
    </>
  )
}
