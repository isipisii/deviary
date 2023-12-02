import BlogPostCard from "@/components/shared/blog-post-card"

export default function FeedContainer() {
  return (
    <div className="w-full flex items-center justify-center">
        <div className="flex gap-12 flex-wrap mt-8">
            {[...new Array(10)].map((_, index) => (
                <BlogPostCard  key={index}/>
            ))}
        </div>
    </div>
  )
}
