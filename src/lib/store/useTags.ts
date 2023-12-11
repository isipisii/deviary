import { FormEvent } from "react";
import { toast } from "sonner";
import { create } from "zustand";

type TTagsState = {
    tags: string[]
    insertTag: (tag: string) => void
    removeTag: (tag: string) => void
    removeAllTags: () => void
    setInitialTags: (tags: string[]) => void
}

export const useTags = create<TTagsState>((set, get) => ({
    tags: [],

    insertTag: (tag) => {
        const formattedTag = tag.toLowerCase().trim().replaceAll(" ", "-")
        const isInserted = get().tags.includes(formattedTag)
        const isTagLimitReached = get().tags.length >= 10

        if(isTagLimitReached) {
            toast.info('Tags are limited to 10 only')
            return;
        }

        if(isInserted || formattedTag === "") {
            return;
        } else {
            set({ tags:  [...get().tags, formattedTag] })
        }
    },
    removeTag: (tag) => {
        const updatedTags = get().tags.filter(item => tag !== item)
        set({ tags: updatedTags })
    },
    removeAllTags: () => {
        set({ tags:[] })
    },
    setInitialTags: (tags) => set({ tags })

}))
