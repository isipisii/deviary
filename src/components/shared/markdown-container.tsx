"use client"

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw"
import remarkToc from 'remark-toc'
import { useTheme } from 'next-themes'

export default function MarkdownContainer({ markdown }: { markdown: string }) {
  const { theme } = useTheme()
  return (
    <div className='w-full'>
      <Markdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm, remarkToc]}
        // className={`prose `}
        className="markdown-body"
      >
        {markdown}
      </Markdown>
    </div>
  )
}
