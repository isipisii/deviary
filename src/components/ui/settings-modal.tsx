import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  RadioGroup,
} from "@nextui-org/react";
import { CustomRadio } from "./custom-radio";
import { useTheme } from "next-themes";

interface ISettingsModal {
  isOpen: boolean;
  onOpenChange: () => void;
}

export default function SettingsModal({
  isOpen,
  onOpenChange,
}: ISettingsModal) {
  const { theme, setTheme } = useTheme();

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      onOpenChange={onOpenChange}
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-30",
        base: "border-[#292f46] bg-cardBg rounded-3xl mx-4 py-3",
      }}
      size="3xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl">Settings</h2>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-navTextColor">
                  Apperance
                </h3>

                <RadioGroup value={theme} onValueChange={setTheme}>
                  <CustomRadio value="light" size="sm" color="secondary">
                    Light
                  </CustomRadio>
                  <CustomRadio value="dark" size="sm" color="secondary">
                    Dark
                  </CustomRadio>
                  <CustomRadio value="system" size="sm" color="secondary">
                    System
                  </CustomRadio>
                </RadioGroup>
              </div>

              {/* <div>
                <h3 className="text-sm font-semibold text-navTextColor">
                  Notification
                </h3>
              </div> */}
            </ModalBody>
            {/* <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="secondary" onPress={onClose}>
              Action
            </Button>
          </ModalFooter> */}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
