"use client"

import { Tabs, Tab } from "@nextui-org/react";
import { RiArticleFill } from "react-icons/ri";
import { FaCode } from "react-icons/fa";
import { Dispatch, SetStateAction } from "react";

interface IPostTypeTab {    
    setSelectedTabItem: Dispatch<SetStateAction<string>>
    selectedTabItem: string
}

export default function PostTypeTab({ selectedTabItem, setSelectedTabItem }: IPostTypeTab) {
  
  return (
    <Tabs 
        aria-label="Options" 
        variant="underlined"
        className="w-full"
        classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0",
            cursor: "w-1/2 bg-secondary h-[3px] rounded-full",
            tab: "max-w-fit px-0 h-12 font-semibold text-md",
            tabContent: "group-data-[selected=true]:text-secondary"
        }}
        selectedKey={selectedTabItem}
        onSelectionChange={(key) => setSelectedTabItem(key as string)}
    >
        <Tab
            key="blog-post"
            title={
            <div className="flex items-center space-x-2">
                <RiArticleFill />
                <span>Blog post</span>
            </div>
            }
        />
        <Tab
            key="diary"
            title={
            <div className="flex items-center space-x-2">
                <FaCode/>
                <span>Diary</span>
            </div>
            }
        />
    </Tabs>
  )
}
