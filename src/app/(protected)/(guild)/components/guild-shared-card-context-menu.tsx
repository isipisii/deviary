"use client";

import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "@nextui-org/react";
import { FaEdit, FaRegEdit } from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";
import { LuTrash } from "react-icons/lu";
import { useDeleteSharedPost } from "@/lib/services/guild-shared-posts.api";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { useDisclosure } from "@nextui-org/react";

// TODO: CREATE A MODAL FOR EDITING THE CONTENT OF THE SHARED POST
export default function GuildSharedCardContextMenu({
  shareId,
  guildId,
}: {
  shareId: string;
  guildId: string;
}) {
  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();
  const { mutate: deleteSharedPostMutation, isPending: isDeleting } =
    useDeleteSharedPost(onClose);

  function handleDeleteSharedPost() {
    deleteSharedPostMutation({ shareId, guildId });
  }

  return (
    <>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        action={handleDeleteSharedPost}
        isPending={isDeleting}
        modalTextContent={{
          header: "Delete shared post?",
          body: "This action is cannot be undone. Are you sure you want to delete this shared post?",
        }}
        buttonText="Delete"
      />
      <Dropdown
        className="rounded-xl border border-borderColor bg-cardBg"
        placement="bottom-end"
      >
        <DropdownTrigger>
          <Button
            variant="light"
            size="sm"
            isIconOnly
            className="z-[5] rounded-lg text-[1.2rem]"
            startContent={<GoKebabHorizontal />}
          />
        </DropdownTrigger>
        <DropdownMenu
          variant="flat"
          aria-label="shared-post-dropdown"
        >
          <DropdownItem
            key="edit"
            startContent={<FaEdit />}
            className="rounded-lg"
          >
            Edit
          </DropdownItem>
          <DropdownItem
            key="delete"
            color="danger"
            className="rounded-lg text-danger"
            startContent={<LuTrash />}
            onPress={onOpen}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
