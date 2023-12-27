import {
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button, 
} from "@nextui-org/react";

interface IDeletePostModal { 
    isOpen: boolean
    onOpenChange: () => void
    handleDelete: () => void
    isDeleting: boolean
}

export default function DeletePostModal({ isOpen, onOpenChange, handleDelete, isDeleting }: IDeletePostModal) {
  return (
    <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        isDismissable={!isDeleting}
        classNames={{ 
            backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
            base: "border-[#292f46] bg-cardBg rounded-2xl ",
        }}
    >
        <ModalContent>
            {(onClose) => (
            <>
                <ModalHeader className="flex flex-col gap-1 font-semibold">Delete post?</ModalHeader>
                <ModalBody>
                    <p className="text-sm">This action cannot be undone. Are you sure you want to delete this post?</p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" size="md" onPress={onClose} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button 
                        color="danger" 
                        size="md" 
                        className="rounded-xl" 
                        isLoading={isDeleting} 
                        onClick={handleDelete}
                    >
                       {isDeleting ? "Deleting" : "Delete"}
                    </Button> 
                </ModalFooter>
            </>
            )}
        </ModalContent>
    </Modal>
  );
}