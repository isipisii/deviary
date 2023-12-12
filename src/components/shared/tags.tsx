"use client"

import { Chip, Input, Button } from "@nextui-org/react"
import { FormEvent, useState } from "react"
import { useEffect } from "react"
import { useTags } from "@/lib/store/useTags"
import { IoClose } from "react-icons/io5";

export default function Tags({ initialTags }: { initialTags?: string[] }) {
    const { tags, insertTag, removeTag, removeAllTags, setInitialTags } = useTags(state => state)
    const showRemoveAll = tags.length >= 3
    const [tag, setTag] = useState("")

    useEffect(() => {
        if(initialTags && initialTags.length > 0) {
            setInitialTags(initialTags)
        } else setInitialTags([])
        
    }, [initialTags, setInitialTags])

    function handleInsertTag(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        insertTag(tag)
        setTag("")
    }

return (
    <form onSubmit={handleInsertTag}>   
        <div className="flex gap-3 flex-wrap max-w-[700px] mb-3">
            {tags.map((tag, index) => (
                <Chip
                    onClose={() => removeTag(tag)}
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
            {showRemoveAll && (
            <Button 
                color="danger"
                variant="bordered" 
                radius="full" 
                startContent={
                    <IoClose />
                }
                onClick={removeAllTags}
                className="font-semibold "
            >
                Remove all
            </Button>
            )}
        </div>
        <Input
            labelPlacement="inside"
            label="Tag (optional)"
            radius="lg"
            variant="bordered"
            className="max-w-[700px] "
            classNames={{
                label: "font-semibold", 
                inputWrapper:" border-borderColor border-2 rounded-xl",
            }}
            value={tag}
            onChange={(e) => setTag(e.target.value)}
        />
    </form>
  )
}
