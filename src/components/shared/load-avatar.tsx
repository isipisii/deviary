import { Avatar, Button } from "@nextui-org/react";
import React, { ChangeEvent } from "react";
import { LuCamera } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

interface ILoadAvatar {
  selectedImage: string;
  handleRemoveImage: () => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  initialImage?: string;
}

export default function LoadAvatar({
  selectedImage,
  handleFileChange,
  handleRemoveImage,
  initialImage,
}: ILoadAvatar) {
  return (
    <div
      className="relative flex h-[130px] w-[130px] flex-col
        items-center gap-2 self-center cursor-pointer"
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
      <label htmlFor="file-input">
        <Avatar
          showFallback
          fallback={
            <LuCamera className="text-[2rem]"  />
          }
          radius="full"
          className="h-[130px] w-[130px]"
          src={selectedImage || initialImage}
          classNames={{ base: "border-borderColor border-2 hover:bg-light bg-transparent cursor-pointer" }}
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
