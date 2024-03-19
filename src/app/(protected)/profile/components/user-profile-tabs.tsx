import { Tab, Tabs } from "@nextui-org/react";
import React from "react";
import { FaCode } from "react-icons/fa6";
import { RiArticleFill } from "react-icons/ri";

export default function UserProfileTabs() {
  return (
    <Tabs
      aria-label="Tabs"
      variant="underlined"
      className="w-full"
      classNames={{
        tabList: "gap-6  w-full relative rounded-none p-0 border-b border-divider",
        cursor: "w-full bg-secondary h-[3px] rounded-full",
        tab: "max-w-fit px-2 h-12 font-semibold md:text-[1rem] text-[.85rem]",
        tabContent: "group-data-[selected=true]:text-secondary",
      }}
    > 
      <Tab
        key="posts"
        title={
          <div className="flex items-center space-x-2">
            <FaCode />
            <span>Posts</span>
          </div>
        }
        >
        <div>
          Posts
        </div>
      </Tab>
      <Tab
        key="blog-posts"
        title={
          <div className="flex items-center space-x-2">
            <RiArticleFill />
            <span>Blog posts</span>
          </div>
        }
      >
        <div>
          Blogpost
        </div>
      </Tab>
      <Tab
        key="diaries"
        title={
          <div className="flex items-center space-x-2">
            <FaCode />
            <span>Diaries</span>
          </div>
        }
        >
        <div>
          Diary
        </div>
      </Tab>
    </Tabs>
  );
}
