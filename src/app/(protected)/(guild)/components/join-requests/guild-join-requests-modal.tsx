"use client";

import { useParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import {
  useGetGuildJoinRequests,
  useGetGuildMembers,
} from "@/lib/services/guild.api";
import { useEffect } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useModalStore } from "@/lib/store/useModalStore";
import { CircularProgress } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/constants";
import { LuBoxes } from "react-icons/lu";
import JoinRequestCard from "./join-request-card";

export default function GuildJoinRequestsModal() {
  const { guildId } = useParams<{ guildId: string }>();
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const currentGuild = queryClient.getQueryData<TGuild>([
    QueryKeys.Guild,
    guildId,
  ]);

  const { isGuildJoinRequestsModalOpen, onOpenChangeGuildJoinRequestsModal } =
    useModalStore((state) => state);
  const { data, isFetchingNextPage, isLoading, fetchNextPage, hasNextPage } =
    useGetGuildJoinRequests(guildId, currentGuild?.isPrivate);

  useEffect(() => {
    /** tracks the if the last elemetnt is in 
    view and theres still a next page*/
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  return (
    <Modal
      isOpen={isGuildJoinRequestsModalOpen}
      onOpenChange={onOpenChangeGuildJoinRequestsModal}
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
                <h2 className="text-center text-xl">Join Requests</h2>
              </div>
            </ModalHeader>
            <ModalBody className="pb-6">
              <div className="h-auto max-h-[70vh] w-full overflow-auto px-1">
                {Array.isArray(data?.pages[0]) ? (
                  <div className="h-[250px]  grid place-items-center w-full">
                    <div className="flex flex-col items-center gap-3 w-[300px]">
                      <p className="text-[3.5rem] text-navTextColor">
                        <LuBoxes />
                      </p>
                      <div className="space-y-2">
                        <h3 className="text-center text-lg font-semibold text-navTextColor">
                          No join requests.
                        </h3>
                        <p className="text-center text-xs font-medium text-navTextColor md:text-base">
                          Just patiently wait for someone to notice your guild, we&apos;ll get there.
                        </p>
                      </div>
                    </div>
                  </div>
                 
                ) : (
                  <div className="flex w-full flex-col gap-3">
                    {data?.pages.map(
                      (page) =>
                        page?.data?.map((joinRequest, index) => {
                          if (index + 1 === page.data.length) {
                            return (
                              <div key={joinRequest.id}>
                                <JoinRequestCard joinRequest={joinRequest} />
                              </div>
                            );
                          }
                          return (
                            <JoinRequestCard joinRequest={joinRequest}
                              key={joinRequest.id}
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
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
