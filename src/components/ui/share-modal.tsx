"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Avatar,
  Button,
} from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/constants";
import { useModalStore } from "@/lib/store/useModalStore";
import formatPostHref from "@/utils/formatPostHref";
import { toast } from "sonner";
import { LuCopy } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import SharePostForm from "@/app/(protected)/(guild)/components/share-post-form";

export default function ShareModal() {
  const queryClient = useQueryClient();
  const [isCopied, setIsCopied] = useState(false);
  const [selectedGuild, setSelectedGuild] = useState<TGuild | null>(null);
  const userGuilds = queryClient.getQueryData<{ guild: TGuild }[]>([
    QueryKeys.MyGuilds,
  ]);
  const {
    isShareModalOpen,
    onOpenChangeShareModal,
    postToShare,
    setPostToShare,
    closeShareModal,
  } = useModalStore((state) => state);

  function closeModal() {
    setPostToShare(null);
    closeShareModal();
    setSelectedGuild(null);
  }

  async function handleCopyToClipboard() {
    if (!postToShare) return;

    try {
      const url = window.origin + formatPostHref(postToShare);
      await window.navigator.clipboard.writeText(url);

      toast.success("Copied to clipboard");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      toast.success("An error occured while copying to clipboard");
    }
  }

  return (
    <Modal
      isOpen={isShareModalOpen}
      placement="center"
      onOpenChange={onOpenChangeShareModal}
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-30",
        base: "border-[#292f46] bg-cardBg rounded-2xl mx-4 py-3",
      }}
      size={selectedGuild ? "sm" : "xl"}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-[5rem]">
              {selectedGuild && (
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => setSelectedGuild(null)}
                  radius="lg"
                  isIconOnly
                  className="text-lg"
                >
                  <FaArrowLeft />
                </Button>
              )}
              <h2 className="text-xl ">Share Post</h2>
            </ModalHeader>
            <ModalBody>
              {/* <div className="flex overflow-hidden"> */}
              {/* right */}
              {!selectedGuild && (
                <div className="flex w-full flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-navTextColor">
                      Share to guild
                    </h3>

                    <div className="flex gap-3">
                      {userGuilds?.map((guild, index) => (
                        <div
                          key={index}
                          className="flex flex-col flex-wrap items-center gap-1"
                          onClick={() => setSelectedGuild(guild.guild)}
                        >
                          <div className="rounded-md p-2">
                            <Avatar
                              isBordered
                              src={guild.guild.image.imageUrl}
                              alt="guild-image"
                              className="h-[40px] w-[40px]"
                            />
                          </div>
                          <p className="text-xs">{guild.guild.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-navTextColor">
                      Others
                    </h3>

                    <div className="flex gap-4">
                      <div className="flex flex-col flex-wrap items-center gap-1">
                        <Button
                          isIconOnly
                          onClick={handleCopyToClipboard}
                          color="secondary"
                          variant="bordered"
                          className="rounded-xl text-lg"
                          size="md"
                        >
                          {isCopied ? <FaCheck /> : <LuCopy />}
                        </Button>
                        <p className="text-xs">Copy link</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* left */}
              {selectedGuild && postToShare && (
                <SharePostForm
                  postToShare={postToShare}
                  guildId={selectedGuild.id}
                  closeModal={closeModal}
                />
              )}
              {/* </div> */}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
