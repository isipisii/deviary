import { ISideBarNavs } from "@/components/sidebar-nav"
import { 
    LuNewspaper, 
    LuSearch, 
    LuFlame, 
    LuBoxes, 
    LuPlus, 
    LuBookmark, 
    LuHistory,
    LuSettings,
    LuPencilLine
} from "react-icons/lu"

export const githubLinkRegex = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+/
export const facebookLinkRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/[\w-]+/
export const linkedinLinkRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/[\w-]+/
export const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

export const sideBarNavs: ISideBarNavs[] = [
    {
        title: "Discover",
        items: [
            {
                title: "Feed",
                href: "/feed",
                icon:  LuNewspaper
            },
            {
                title: "Create Post",
                href: "/post/create",
                icon:  LuPencilLine
            },
            {
                title: "Search",
                href: "/search",
                icon: LuSearch
            },
            {
                title: "Popular",
                href: "/popular",
                icon: LuFlame
            },
        ]
    },

    {
        title: "Guild",
        items: [
            {
                title: "Guilds",
                href: "/guilds",
                icon: LuBoxes
            },
            {
                title: "New Guild",
                href: "/new-guild",
                icon: LuPlus
            },
            // {
            //     title: "ReactJS",
            //     href: "/guild",
            //     type: "guild",
            //     imageUrl: "https://avatars.githubusercontent.com/u/6412038?s=200&v=4"
            // },
            // {
            //     title: "Libre Minds",   
            //     href: "/guild",
            //     type: "guild",
            //     imageUrl: "https://avatars.githubusercontent.com/u/148235334?s=200&v=4"
            // },  
            // {
            //     title: "Libre Minds",   
            //     href: "/guild",
            //     type: "guild",
            //     imageUrl: "https://avatars.githubusercontent.com/u/148235334?s=200&v=4"
            // },  
            // {
            //     title: "ReactJS",
            //     href: "/guild",
            //     type: "guild",
            //     imageUrl: "https://avatars.githubusercontent.com/u/6412038?s=200&v=4"
            // },
        ]
    },

    {
        title: "Manage",
        items: [
            {
                title: "Bookmarks",
                href: "/bookmarks",
                icon: LuBookmark
            },
            {
                title: "History",
                href: "/history",
                icon: LuHistory
            },
            {
                title: "Settings",
                href: "/settings",
                icon: LuSettings
            },
        ]
    },

]

export const postContextMenuItems = [
    {
        label: "Bookmark",
        key: "bookmark"
    },
    {
        label: "Copy link",
        key: "copy-link"
    },
    {
        label: "Edit",
        key: "edit"
    },
    {
        label: "Delete",
        key: "delete"
    },

  ]