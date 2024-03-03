import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import SharePostForm from "./share-post-form";
import { useModalStore } from "@/lib/store/useModalStore";

export default function EditSharedPostModal() {
  const {
    isEditSharedPostModalOpen,
    onOpenChangeEditSharedPostModal,
    sharedPostToEdit,
  } = useModalStore((state) => state);

  return (
    <Modal
      isOpen={isEditSharedPostModalOpen}
      onOpenChange={onOpenChangeEditSharedPostModal}
      placement="center"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-30",
        base: "border-[#292f46] bg-cardBg rounded-2xl mx-4",
      }}
      size="sm"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <div className="w-full">
                <h2 className="text-xl text-center">Edit Shared Post</h2>
              </div>
            </ModalHeader>
            <ModalBody className="pb-6">
              {sharedPostToEdit && (
                <SharePostForm
                  isEditing={true}
                  shareId={sharedPostToEdit.id}
                  guildId={sharedPostToEdit.guildId}
                  postToShare={sharedPostToEdit.post}
                  initialValue={sharedPostToEdit.content}
                  closeModal={onClose}
                />
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
