import { ChangeEvent, useState } from "react"

export default function useLoadImageFile(initialImageUrl?: string) {
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
    const [selectedImage, setSelectedImage] = useState(initialImageUrl ?? "")

    function handleFileChange(e: ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0]
        setSelectedImage(file ? URL.createObjectURL(file) : "")
        setSelectedImageFile(file ?? null)
    }

    function handleRemoveImage() {
        setSelectedImage("")
        setSelectedImageFile(null)
    }

    return {
        handleFileChange,
        selectedImage,
        selectedImageFile,
        handleRemoveImage
    }
}


  

