import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";

export default function EmptyState({
  buttonText,
  description,
  header,
  Icon
}: {
  buttonText: string;
  description: string;
  header: string;
  Icon: IconType
}) {
  return (
    <div className="grid h-[70vh] place-items-center">
      <div className="flex flex-col items-center gap-4">
        <p className="text-[5rem] text-navTextColor">
          <Icon />
        </p>
        <div className="space-y-2">
          <h3 className="text-center text-2xl font-semibold text-navTextColor md:text-3xl">
            {header}
          </h3>
          <p className="text-center text-sm font-medium text-navTextColor md:text-base">
            {description}
          </p>
        </div>

        <Button
          as={Link}
          href="/feed"
          color="secondary"
          variant="light"
          className="font-semibold"
          size="md"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
