"use client";

import { useParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useGetGuildMembers } from "@/lib/services/guild.api";
import { useEffect } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import MemberCard from "./member-card";
import { useModalStore } from "@/lib/store/useModalStore";
import { CircularProgress } from "@nextui-org/react";

export default function GuildMembersModal() {
  const { isGuildMembersModalOpen, onOpenChangeGuildMembersModal } =
    useModalStore((state) => state);
  const { ref, inView } = useInView();
  const params = useParams<{ guildId: string }>();
  const { data, isFetchingNextPage, isLoading, fetchNextPage, hasNextPage } =
    useGetGuildMembers(params.guildId);

  useEffect(() => {
    // checks if the last element that has the ref and if theres next page in order to
    // fetch the next page
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  return (
    <Modal
      isOpen={isGuildMembersModalOpen}
      onOpenChange={onOpenChangeGuildMembersModal}
      placement="center"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-30",
        base: "border-[#292f46] bg-cardBg rounded-2xl mx-4",
      }}
      size="2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <div className="w-full pt-4">
                <h2 className="text-center text-xl">Guild Members</h2>
              </div>
            </ModalHeader>
            <ModalBody className="pb-6">
              <div className="h-auto max-h-[70vh] w-full overflow-auto px-1">
                <div className="flex w-full flex-col gap-3">
                  {data?.pages.map(
                    (page) =>
                      page?.data?.map((guildMember, index) => {
                        if (index + 1 === page.data.length) {
                          return (
                            <div key={guildMember.id}>
                              <MemberCard guildMember={guildMember} />
                            </div>
                          );
                        }
                        return (
                          <MemberCard
                            guildMember={guildMember}
                            key={guildMember.id}
                          />
                        );
                      }),
                  )}
                  {(isLoading || isFetchingNextPage) && (
                    <CircularProgress
                      color="secondary"
                      size="sm"
                      className="self-center"
                    />
                  )}
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
