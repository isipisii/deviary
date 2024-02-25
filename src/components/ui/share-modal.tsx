"use client"

import { Modal, ModalBody, ModalContent, ModalHeader, Avatar } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/constants";

export default function ShareModal({ isOpen, onOpenChange }: {isOpen: boolean, onOpenChange: () => void}) {
  const queryClient = useQueryClient()
  const userGuilds = queryClient.getQueryData<{ guild: TGuild }[]>([QueryKeys.MyGuilds ])

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      onOpenChange={onOpenChange}
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-30",
        base: "border-[#292f46] bg-cardBg rounded-2xl mx-4 py-3",
      }}
      size="xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl">Share Post</h2>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-navTextColor">
                  Share to guild
                </h3>

                <div className="flex gap-4">
                    {userGuilds?.map((guild, index) => (
                        <div key={index} className="flex gap-3 items-center py-3 px-4 bg-light rounded-xl">
                            <Avatar isBordered src={guild.guild.image.imageUrl} alt="guild-image" className="h-[30px] w-[30px]"  />
                            <p className="font-semibold">{guild.guild.name}</p>
                        </div>
                    ))} 
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-navTextColor">
                  Others
                </h3>
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
