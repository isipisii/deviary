import { create } from "zustand";

type TSideBarNavState = {
  isShareModalOpen: boolean;
  openShareModal: () => void;
  closeShareModal: () => void;
  onOpenChangeShareModal: () => void;
  setPostToShare: (post: TPost | null) => void;
  postToShare: TPost | null;

  isEditSharedPostModalOpen: boolean;
  openEditSharedPostModal: () => void;
  onOpenChangeEditSharedPostModal: () => void;
  sharedPostToEdit: TGuildSharedPost | null;
  setSharedPostToEdit: (sharedPostToEdit: TGuildSharedPost | null) => void;
};

export const useModalStore = create<TSideBarNavState>((set, get) => ({
  isShareModalOpen: false,
  postToShare: null,

  sharedPostToEdit: null,
  isEditSharedPostModalOpen: false,

  openShareModal: () => set({ isShareModalOpen: true }),
  closeShareModal: () => set({ isShareModalOpen: false }),
  onOpenChangeShareModal: () => set({ isShareModalOpen: !get().isShareModalOpen }),
  setPostToShare: (post) => set({ postToShare: post }),

  openEditSharedPostModal: () => set({ isEditSharedPostModalOpen: true }),
  onOpenChangeEditSharedPostModal: () => set({ isEditSharedPostModalOpen: !get().isEditSharedPostModalOpen }),
  setSharedPostToEdit: (sharedPostToEdit) => set({ sharedPostToEdit }),
}));
