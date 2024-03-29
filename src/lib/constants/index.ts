import { ISideBarNav, ISideBarNavItem } from "@/components/layout/sidebar-nav";
import {
  LuNewspaper,
  LuSearch,
  LuFlame,
  LuBoxes,
  LuPlus,
  LuBookmark,
  LuBookMarked,
  LuHistory,
  LuSettings,
  LuPencilLine,
  LuTrash,
  LuUser2
} from "react-icons/lu";

import { HiOutlinePaintBrush } from "react-icons/hi2";

import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { FiCopy } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";

export const githubLinkRegex = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+/;
export const facebookLinkRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/[\w-]+/;
export const linkedinLinkRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/[\w-]+/;
export const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const QueryKeys = {
  Posts: "posts",
  Bookmarks: "bookmarks",
  SearchedPosts: "searchedPosts",
  SuggestedTitles: "suggestedTitles",
  Notifications: "notifications",
  Comments: "comments",
  PostsByTag: "postsByTag",
  MyGuilds: "myGuilds",
  Guild: "guild",
  Guilds: "guilds",
  PopularPosts: "popularPosts",
  CurrentFeedFilter: "currentFeedFilter",
  GuildSharedPosts: "guildSharedPosts",
  GuildMembers: "guildMembers",
  GuildJoinRequests: "guildJoinRequests",
  CurrentGuildsFilter: "currentGuildsFilter",
  ReadingHistories: "readingHistories",
  User: "user",
  PostsByAuthor: "postsByAuthor"
} as const;

export const sideBarNavs: ISideBarNav[] = [
  {
    title: "Discover",
    items: [
      {
        title: "Feed",
        href: "/feed",
        icon: LuNewspaper,
      },
      {
        title: "Create Post",
        href: "/post/create",
        icon: LuPencilLine,
      },
      {
        title: "Search",
        href: "/search",
        icon: LuSearch,
      },
      {
        title: "Popular",
        href: "/popular",
        icon: LuFlame,
      },
    ],
  },

  {
    title: "Guild",
    items: [
      {
        title: "Guilds",
        href: "/guilds",
        icon: LuBoxes,
      },
      {
        title: "New Guild",
        href: "/new-guild",
        icon: LuPlus,
      },
    ],
  },

  {
    title: "Manage",
    items: [
      {
        title: "Bookmarks",
        href: "/bookmarks",
        icon: LuBookmark,
      },
      {
        title: "History",
        href: "/history",
        icon: LuHistory,
      },
      {
        title: "Settings",
        href: "/settings/profile",
        icon: LuSettings,
      },
    ],
  },
];

export const mobileBottomNavItems = [
  ...sideBarNavs[0].items,
  {
    title: "Bookmarks",
    href: "/bookmarks",
    icon: LuBookmark,
  },
];

export const mobileSideNavItems = sideBarNavs
  .filter((nav) => nav.title !== "Discover")
  .map((nav) =>
    nav.title === "Manage"
      ? {
          ...nav,
          items: nav.items.filter((item) => item.title !== "Bookmarks"),
        }
      : nav,
  );

  export const settingsSideNavItems = [
    {
      title: "Profile",
      href: "/settings/profile",
      icon: LuUser2,
    },
    {
      title: "Appearance",
      href: "/settings/appearance",
      icon: HiOutlinePaintBrush,
    },
  ]

export const postContextMenuItems = [
  {
    label: "Bookmark",
    key: "bookmark",
    activeIcon: FaBookmark,
    icon: FaRegBookmark,
  },
  {
    label: "Edit",
    key: "edit",
    icon: FaRegEdit,
  },
  {
    label: "Delete",
    key: "delete",
    icon: LuTrash,
  },
];
