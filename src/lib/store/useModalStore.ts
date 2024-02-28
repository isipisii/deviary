import { create } from "zustand";

type TSideBarNavState = {
    isShareModalOpen: boolean
    openShareModal: () => void
    closeShareModal: () => void
    onOpenChangeShareModal: () => void
    setPostToShare: (post: TPost | null) => void
    postToShare: TPost | null
}

export const useModalStore = create<TSideBarNavState>((set, get) => ({
    isShareModalOpen: false,
    postToShare: null,

    openShareModal: () => set({isShareModalOpen: true}),
    closeShareModal: () => set({isShareModalOpen: false}),
    onOpenChangeShareModal: () => set({ isShareModalOpen: !get().isShareModalOpen }),
    setPostToShare: (post) => set({ postToShare: post })
}))