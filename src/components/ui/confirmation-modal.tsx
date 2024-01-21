import {
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button, 
} from "@nextui-org/react";

interface IConfirmationModal { 
    isOpen: boolean
    onOpenChange: () => void
    action: () => void
    isPending: boolean
    modalTextContent: { header: string, body: string }
    isDelete?: boolean
}

export default function ConfirmationModal({ isOpen, onOpenChange, action, isPending, modalTextContent, isDelete = true }: IConfirmationModal) {

    function buttonText() {
        if(isDelete){
            return isPending ? "Deleting" : "Delete" 
        }
        return isPending ? "Logging out" : "Log out" 
    }
    
  return (
    <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        isDismissable={!isPending}
        classNames={{ 
            backdrop: "bg-[#292f46]/50 backdrop-opacity-30",
            base: "border-[#292f46] bg-cardBg rounded-2xl ",
        }}
    >
        <ModalContent>
            {(onClose) => (
            <>
                <ModalHeader className="flex flex-col gap-1 font-semibold">{modalTextContent.header}</ModalHeader>
                <ModalBody>
                    <p className="text-sm">{modalTextContent.body}</p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" size="md" onPress={onClose} isDisabled={isPending} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button 
                        color="danger" 
                        size="md" 
                        className="rounded-xl" 
                        isLoading={isPending} 
                        onClick={action}
                    >
                       {buttonText()}
                    </Button> 
                </ModalFooter>
            </>
            )}
        </ModalContent>
    </Modal>
  );
}