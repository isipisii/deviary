import { Button } from "@nextui-org/react";
import { ChangeEvent } from "react";
import { FaImage } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface ILoadThumbnail {
    selectedImage: string;
    handleRemoveImage: () => void;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
  
export default function LoadThumbnail({ selectedImage, handleFileChange, handleRemoveImage }: ILoadThumbnail) {
  return (
    <div 
        className="flex flex-col items-center gap-2 relative 
        h-[150px] w-[300px] rounded-2xl border-borderColor border-2"
    >
        {selectedImage && (
        <Button
            variant="flat"
            isIconOnly
            radius="full"
            className="absolute top-2 right-2 text-[1.3rem]"
            onClick={handleRemoveImage}
        >
            <IoClose />
        </Button>
        )}
        <label htmlFor="file-input" className="w-full h-full">
            {selectedImage ? (
                //eslint-disable-next-line @next/next/no-img-element
                <img className="w-full h-full rounded-2xl object-cover cursor-pointer" src={selectedImage} alt="Thumbnail" />
            ) : (
                <div className="flex items-center justify-center cursor-pointer w-full h-full hover:bg-light transition-all ease-in-out duration-1000 rounded-xl">
                    <div className="flex items-center gap-2">
                        <FaImage />
                        <p className="font-semibold text-sm">Thumbnail</p>
                    </div>
                </div>
            )}      
        </label>
        <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
        />
    </div>
  )
}