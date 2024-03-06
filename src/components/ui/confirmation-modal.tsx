import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

interface IConfirmationModal {
  isOpen: boolean;
  onOpenChange: () => void;
  action: () => void;
  isPending: boolean;
  modalTextContent: { header: string; body: string };
  buttonText: string
}

export default function ConfirmationModal({
  isOpen,
  onOpenChange,
  action,
  isPending,
  modalTextContent,
  buttonText
}: IConfirmationModal) {

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!isPending}
      placement="center"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-30",
        base: "border-[#292f46] bg-cardBg rounded-2xl mx-4",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 font-semibold">
              {modalTextContent.header}
            </ModalHeader>
            <ModalBody>
              <p className="text-sm">{modalTextContent.body}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                size="md"
                onPress={onClose}
                isDisabled={isPending}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                size="md"
                className="rounded-xl"
                isLoading={isPending}
                onClick={action}
              >
                {buttonText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
