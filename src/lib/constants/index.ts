import { ISideBarNavs } from "@/components/sidebar-nav"

export const sideBarNavs: ISideBarNavs[] = [
    {
        title: "Discover",
        items: [
            {
                title: "Feed",
                href: "/feed",
                icon: "newspaper"
            },
            {
                title: "Search",
                href: "/search",
                icon: "search"
            },
            {
                title: "Popular",
                href: "/popular",
                icon: "flame"
            },
        ]
    },

    {
        title: "Guild",
        items: [
            {
                title: "Public Guilds",
                href: "/public-guilds",
                icon: "boxes"
            },
            {
                title: "New Guild",
                href: "/new-guild",
                icon: "plus"
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
        ]
    },

    {
        title: "Manage",
        items: [
            {
                title: "Bookmarks",
                href: "/bookmarks",
                icon: "bookmark"
            },
            {
                title: "History",
                href: "/history",
                icon: "history"
            },
            {
                title: "Settings",
                href: "/settings",
                icon: "settings"
            },
        ]
    },

]