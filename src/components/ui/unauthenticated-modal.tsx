"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Button,
} from "@nextui-org/react";
import Logo from "./logo";
import Link from "next/link";
import { useModalStore } from "@/lib/store/useModalStore";

export default function UnauthenticatedModal() {
  const { isUnauthenticatedModalOpen, onOpenChangeUnauthenticatedModal } = useModalStore((state) => state);
  return (
    <Modal
      isOpen={isUnauthenticatedModalOpen}
      placement="center"
      onOpenChange={onOpenChangeUnauthenticatedModal}
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-30",
        base: "border-[#292f46] bg-cardBg rounded-2xl mx-4 py-3",
      }}
      size="lg"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col items-center gap-4">
              <Link href="/">
                <Logo />
              </Link>
              <div className="flex flex-col gap-2 ">
                <h2 className="text-center text-xl">Sign in to continue</h2>
                <p className="text-center text-sm font-normal text-navTextColor">
                  Log in to stay relevant and keep updated with the latest tech
                  trend.
                </p>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex w-full flex-col gap-4">
                <Button
                  as={Link}
                  href="/sign-in"
                  color="secondary"
                  className="font-medium text-white"
                  radius="lg"
                >
                  Sign in
                </Button>

                <Button
                  as={Link}
                  href="/sign-up"
                  color="secondary"
                  className="font-medium"
                  radius="lg"
                  variant="bordered"
                >
                  Create an account
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
