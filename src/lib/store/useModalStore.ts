import { boolean } from "zod";
import { create } from "zustand";

type TModalStoreState = {
  // for share post modal 
  isShareModalOpen: boolean;
  openShareModal: () => void;
  closeShareModal: () => void;
  onOpenChangeShareModal: () => void;
  setPostToShare: (post: TPost | null) => void;
  postToShare: TPost | null;

  // for editing shared post modal 
  isEditSharedPostModalOpen: boolean;
  openEditSharedPostModal: () => void;
  onOpenChangeEditSharedPostModal: () => void;
  sharedPostToEdit: TGuildSharedPost | null;
  setSharedPostToEdit: (sharedPostToEdit: TGuildSharedPost | null) => void;

  //for guild members modal 
  isGuildMembersModalOpen: boolean
  openGuildMembersModal: () => void;
  onOpenChangeGuildMembersModal: () => void;

   //for guild join-requests modal 
   isGuildJoinRequestsModalOpen: boolean
   openGuildJoinRequestsModal: () => void;
   onOpenChangeGuildJoinRequestsModal: () => void;
};

export const useModalStore = create<TModalStoreState>((set, get) => ({
  // for share post modal 
  isShareModalOpen: false,
  postToShare: null,
  openShareModal: () => set({ isShareModalOpen: true }),
  closeShareModal: () => set({ isShareModalOpen: false }),
  onOpenChangeShareModal: () => set({ isShareModalOpen: !get().isShareModalOpen }),
  setPostToShare: (post) => set({ postToShare: post }),

  // for editing shared post modal 
  sharedPostToEdit: null,
  isEditSharedPostModalOpen: false,
  openEditSharedPostModal: () => set({ isEditSharedPostModalOpen: true }),
  onOpenChangeEditSharedPostModal: () => set({ isEditSharedPostModalOpen: !get().isEditSharedPostModalOpen }),
  setSharedPostToEdit: (sharedPostToEdit) => set({ sharedPostToEdit }),

  //for guild members modal 
  isGuildMembersModalOpen: false,
  openGuildMembersModal: () => set({ isGuildMembersModalOpen: true }),
  onOpenChangeGuildMembersModal: () => set({ isGuildMembersModalOpen: !get().isGuildMembersModalOpen }),

  //for guild join-requests modal 
  isGuildJoinRequestsModalOpen: false,
  openGuildJoinRequestsModal: () => set({isGuildJoinRequestsModalOpen: true}),
  onOpenChangeGuildJoinRequestsModal: () => set({isGuildJoinRequestsModalOpen: !get().isGuildJoinRequestsModalOpen})
}));
