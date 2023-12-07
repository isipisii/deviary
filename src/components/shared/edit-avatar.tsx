"use client"

import { Avatar, Button } from "@nextui-org/react";
import React, { ChangeEvent } from "react";
import { IoClose } from "react-icons/io5";

interface IEditAvatar {
  selectedImage: string;
  handleRemoveImage: () => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  userCurrentImage: string;
}

export default function EditAvatar({
  selectedImage,
  handleFileChange,
  handleRemoveImage,
  userCurrentImage,
}: IEditAvatar) {
    
  return (
    <div 
        className="flex flex-col items-center gap-2 relative 
        h-[150px] w-[150px] self-center"
    >
        {selectedImage && (
        <Button
            variant="flat"
            isIconOnly
            radius="full"
            className="absolute top-0 -right-3 z-20 text-[1.3rem]"
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
            onChange={handleFileChange}
            className="hidden"
        />
    </div>
  );
}
