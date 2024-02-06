"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Spinner,
} from "@nextui-org/react";
import { useDeleteComment } from "@/lib/services/comments.api";
import { LuTrash } from "react-icons/lu";
import { GoKebabHorizontal } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";

export default function CommentContextMenu({ comment, showEditForm }: { comment: TComment, showEditForm(): void }) {
  const { mutate: deleteCommentMutation, isPending: isDeleting } =
    useDeleteComment();

  return (
    <Dropdown
      className="rounded-xl border border-borderColor bg-background"
      placement="bottom-end"
    >
      <DropdownTrigger
        onClick={(e) => {
          e.preventDefault();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        <Button
          variant="light"
          size="sm"
          isIconOnly
          className="z-[5] rounded-lg text-[1rem]"
          startContent={<GoKebabHorizontal />}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dynamic Actions"
        variant="flat"
      >
        <DropdownItem
          key="edit"
          startContent={<FaRegEdit />}
          className="rounded-lg"
          onClick={showEditForm}
        >
          Edit
        </DropdownItem>
        <DropdownItem
          key="delete"
          startContent={
            isDeleting ? <Spinner size="sm" color="danger" /> : <LuTrash />
          }
          className="rounded-lg text-danger"
          color="danger"
          onClick={() => {
            if(isDeleting) return
            deleteCommentMutation(comment.id)
          }}
        >
          {isDeleting ? "Deleting" : "Delete"}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
