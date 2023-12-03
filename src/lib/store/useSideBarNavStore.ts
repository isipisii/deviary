import { create } from "zustand";

type TSideBarNavState = {
    isSideBarMinimized: boolean
    minimizeSideBar: () => void
    maximizeSideBar: () => void
}

export const useSideBarNavStore = create<TSideBarNavState>((set, get) => ({
    isSideBarMinimized: false,

    minimizeSideBar: () => set({isSideBarMinimized: true}),
    maximizeSideBar: () => set({isSideBarMinimized: false})
}))