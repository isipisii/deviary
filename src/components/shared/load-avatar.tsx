"use client";

import { Avatar, Button } from "@nextui-org/react";
import React, { ChangeEvent } from "react";
import { IoClose } from "react-icons/io5";

interface ILoadAvatar {
  selectedImage: string;
  handleRemoveImage: () => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  userCurrentImage: string;
}

export default function LoadAvatar({
  selectedImage,
  handleFileChange,
  handleRemoveImage,
  userCurrentImage,
}: ILoadAvatar) {
  return (
    <div
      className="relative flex h-[150px] w-[150px] flex-col 
        items-center gap-2 self-center"
    >
      {selectedImage && (
        <Button
          variant="flat"
          isIconOnly
          radius="full"
          className="absolute -right-3 top-0 z-20 text-[1.3rem]"
          onClick={handleRemoveImage}
        >
          <IoClose />
        </Button>
      )}
      <label htmlFor="file-input" className="cursor-pointer">
        <Avatar
          radius="full"
          className="h-[150px] w-[150px]"
          src={selectedImage || userCurrentImage}
          classNames={{ base: "border-borderColor border" }}
        />
      </label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
