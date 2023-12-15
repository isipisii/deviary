"use client"

import { useState } from "react"
import PostTypeTab from "./post-type-tab"
import BlogPostForm from "./blog-post-form"
import DiaryForm from "./diary-form"

export default function CreatePostContainer() {
  const [selectedTabItem, setSelectedTabItem] = useState("blog-post")

  return (
    <div className="space-y-6">
        <PostTypeTab selectedTabItem={selectedTabItem} setSelectedTabItem={setSelectedTabItem} />
        {selectedTabItem === "blog-post" && <BlogPostForm />}
        {selectedTabItem === "diary" && <DiaryForm />}
    </div>
  )
}
