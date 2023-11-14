import { ISideBarNavs } from "@/components/sidebar-nav"
import { 
    LuNewspaper, 
    LuSearch, 
    LuFlame, 
    LuBoxes, 
    LuPlus, 
    LuBookmark, 
    LuHistory,
    LuSettings
} from "react-icons/lu"

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
                title: "Public Guilds",
                href: "/public-guilds",
                icon: LuBoxes
            },
            {
                title: "New Guild",
                href: "/new-guild",
                icon: LuPlus
            },
            {
                title: "ReactJS",
                href: "/guild",
                type: "guild",
                imageUrl: "https://avatars.githubusercontent.com/u/6412038?s=200&v=4"
            },
            {
                title: "Libre Minds",   
                href: "/guild",
                type: "guild",
                imageUrl: "https://avatars.githubusercontent.com/u/148235334?s=200&v=4"
            },  
            {
                title: "Libre Minds",   
                href: "/guild",
                type: "guild",
                imageUrl: "https://avatars.githubusercontent.com/u/148235334?s=200&v=4"
            },  
            {
                title: "ReactJS",
                href: "/guild",
                type: "guild",
                imageUrl: "https://avatars.githubusercontent.com/u/6412038?s=200&v=4"
            },
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