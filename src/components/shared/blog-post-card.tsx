/* eslint-disable @next/next/no-img-element */
"use client"

import truncateString from "@/utils/truncateString"
import { Avatar } from "@nextui-org/react";
import PostActions from "../ui/post-actions";

interface IBlogPostCard {
    post: TPost
}

export default function BlogPostCard({ post }: IBlogPostCard) {
  const { thumbnail, content, title } = post?.blog as TBlog
  const { name, image } = post.author as TUser

  return (
    <div className="h-[400px] w-[330px] rounded-3xl border-2 border-borderColor shadow-lg">
        <div className="relative h-full w-full">
            {/* image and bg gradient */}
            <img 
                // src={index % 2 === 0 ? "https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/c9351b4fa8cdb6f53a50c523baf7965e?_a=AQAEufR" : "/images/nxt.png"}
                src={thumbnail?.imageUrl ?? "https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/321132ebaae9e0f22b7727d30efe160a?_a=AQAEufR"}
                alt="basta" 
                className="w-full h-full object-cover rounded-3xl"
            />
            <div 
                className="w-full absolute bottom-0 left-0 rounded-b-3xl h-full bg-gradient-to-t from-[#0C1319]
                via-[#0c1319c8] to-[#24253300]"
            />
            
            {/* blog details */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] flex justify-center flex-col gap-2">
                <div className='grid gap-1'>
                    <Avatar
                        src={image as string}
                        className="h-[40px] w-[40px]"
                    />
                    <h3 className="font-bold text-xl text-white shadow-lg">{truncateString(title)}</h3>
                </div>
                <div>
                    <p className="text-sm text-[#A1A1AA]">Yesterday</p>
                </div>
                {/* blog actions */}
                <PostActions />
            </div>      
        </div>                                                              
    </div>   
  )
}

