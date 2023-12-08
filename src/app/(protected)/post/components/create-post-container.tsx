"use client"

import { Tabs, Tab } from "@nextui-org/react";
import { RiArticleFill } from "react-icons/ri";
import { FaCode } from "react-icons/fa";
import CreateBlogPostForm from "./create-blog-post-form";
import CreateDiaryForm from "./create-diary-form";

export default function CreatePostContainer() {

  return (
    <div className="border border-borderColor">
        <Tabs 
            aria-label="Options" 
            variant="underlined"
            className="w-full"
            classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0",
                cursor: "w-1/2 bg-secondary h-[3px] rounded-full",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-secondary"
            }}
        >
            <Tab
                key="blog-post"
                title={
                <div className="flex items-center space-x-2">
                    <RiArticleFill />
                    <span>Blog post</span>
                </div>
                }
            >
                <CreateBlogPostForm />
            </Tab>
            <Tab
                key="diary"
                title={
                <div className="flex items-center space-x-2">
                    <FaCode/>
                    <span>Diary</span>
                </div>
                }
            >
                <CreateDiaryForm />
            </Tab>
        </Tabs>
    </div>
  )
}