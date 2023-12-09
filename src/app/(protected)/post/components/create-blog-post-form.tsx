"use client"
import useLoadImageFile from "@/lib/hooks/useLoadImageFile"
import { Button, Input, Textarea, Chip } from "@nextui-org/react"
import LoadThumbnail from "@/components/shared/load-thumbnail";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function CreateBlogPostForm() {
  const { handleFileChange, selectedImage, selectedImageFile, handleRemoveImage } = useLoadImageFile()
  const [tags, setTags] = useState<string[]>([])
  const showRemoveAll = tags.length >= 3
  const [tag, setTag] = useState("")

  function handleInsertTag(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formattedTag = tag.toLowerCase().trim().replaceAll(" ", "-")
    const isInserted = tags.includes(formattedTag)
    const isTagLimitReached = tags.length >= 10

    if(isTagLimitReached) {
        toast.info('Tags are limited to 10 only')
        return;
    }

    if(isInserted || formattedTag === "") {
        setTag("")
        return;
    } else {
        setTags(prevTags => [...prevTags, formattedTag])
        setTag("")
    }
  }

  function handleRemoveTag(tag: string) { 
    setTags(tags.filter(item => tag !== item))
  }

  function handleRemoveAllTags() {
    setTags([])
  }

  return (
    <div className="h-auto flex flex-col gap-4">
        <LoadThumbnail
            handleFileChange={handleFileChange}
            selectedImage={selectedImage}
            handleRemoveImage={handleRemoveImage}
        />
        <form onSubmit={handleInsertTag} className="grid gap-3">
            <div className="flex gap-3 flex-wrap max-w-[700px]">
                {tags.map((tag, index) => (
                    <Chip 
                        onClose={() => handleRemoveTag(tag)}
                        radius="full"
                        size="lg"
                        color="secondary"
                        variant="dot"
                        classNames={{
                            base: "border-borderColor border-2"
                        }}
                        key={index}
                    >
                        {tag}
                    </Chip>
                ))}
            </div>
            <Input
                labelPlacement="inside"
                label="Tag (optional)"
                radius="lg"
                variant="bordered"
                className="max-w-[700px] "
                classNames={{
                    label: "font-semibold", 
                    inputWrapper:"bg-light border-borderColor border-2 rounded-xl",
                }}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
            />
        </form>
        <Input
            labelPlacement="inside"
            isRequired
            label="Title"
            radius="lg"
            variant="bordered"
            className="max-w-[700px] "
            classNames={{
                label: "font-semibold", 
                inputWrapper:"bg-light border-borderColor border-2 rounded-xl",
            }}
        />

        <Textarea
            isRequired
            variant="bordered"
            label="Content"
            maxRows={20}
            className="max-w-[700px]"
            classNames={{
                label: "font-semibold",
                inputWrapper:"bg-light border-borderColor border-2 rounded-xl",
            }}
        />
    </div>
  )
}
