"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { HiMiniArrowLongLeft } from "react-icons/hi2";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="light"
      size="md"
      onClick={() => router.back()}
      className="absolute left-2 top-2 rounded-xl text-sm font-semibold md:left-5 md:top-5 md:text-base"
      isIconOnly
    >
      <HiMiniArrowLongLeft className="text-[1.7rem] md:text-[2rem]" />
    </Button>
  );
}
