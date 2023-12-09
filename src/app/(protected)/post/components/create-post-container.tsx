"use client"

import { useState } from "react"
import PostTypeTab from "./post-type-tab"
import CreateBlogPostForm from "./create-blog-post-form"
import CreateDiaryForm from "./create-diary-form"

export default function CreatePostContainer() {
  const [selectedTabItem, setSelectedTabItem] = useState("blog-post")

  return (
    <div className="space-y-6">
        <PostTypeTab selectedTabItem={selectedTabItem} setSelectedTabItem={setSelectedTabItem} />
        {selectedTabItem === "blog-post" && <CreateBlogPostForm />}
        {selectedTabItem === "diary" && <CreateDiaryForm />}
    </div>
  )
}
