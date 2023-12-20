/* eslint-disable @next/next/no-img-element */
"use client"

import truncateString from "@/utils/truncateString"
import { Button, Tooltip } from "@nextui-org/react"
import { useSession } from "next-auth/react"
import { TbArrowBigUp, TbArrowBigUpFilled, TbShare3 } from "react-icons/tb";
import { Avatar } from "@nextui-org/react";
import { FaRegComments } from "react-icons/fa";

interface IBlogPostCard {
    post: TPost
}

export default function BlogPostCard({ post }: IBlogPostCard) {
  const { data } = useSession()
  const { thumbnail, content, title } = post?.blog as TBlog

  return (
    <div className="relative h-[400px] w-[300px] rounded-3xl border-2 border-borderColor shadow-2xl">
        {/* image and bg gradient */}
        <img 
            // src={index % 2 === 0 ? "https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/c9351b4fa8cdb6f53a50c523baf7965e?_a=AQAEufR" : "/images/nxt.png"}
            src={thumbnail.imageUrl ?? "https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/321132ebaae9e0f22b7727d30efe160a?_a=AQAEufR"}
            alt="basta" 
            className="w-full h-full object-cover rounded-3xl"
        />
        <div 
            className="w-full absolute bottom-0 rounded-b-3xl h-full bg-gradient-to-t from-[#0C1319]
            via-[#0c1319c8] to-[#24253300]"
        />
        
        {/* blog details */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] flex justify-center flex-col gap-2">
            <div className='grid gap-1'>
                <Avatar
                    src={data?.user.image as string}
                    className="h-[40px] w-[40px]"
                />
                <h3 className="font-bold text-xl text-white shadow-lg">{truncateString(title)}</h3>
            </div>
            <div>
                <p className="text-sm text-[#A1A1AA]">Yesterday</p>
            </div>
            {/* blog actions */}
            <div className="flex items-center justify-between">
                <Tooltip 
                    placement="bottom" 
                    content="Upvote" 
                    className="bg-background z-10" 
                    showArrow  
                    classNames={{
                        base: [
                          // arrow color
                          "before:bg-background dark:before:bg-background",
                        ],
                    }}
                >
                    <Button 
                        isIconOnly 
                        className="text-2xl rounded-xl text-[#A1A1AA] bg-[#fff0] 
                        hover:bg-[#34b60058] hover:text-[#34FF00]"
                    >
                        <TbArrowBigUp /> 
                    </Button>
                </Tooltip>

                <Tooltip 
                    placement="bottom" 
                    content="Comments" 
                    className="bg-background z-10" 
                    showArrow 
                    classNames={{
                        base: [
                          // arrow color
                          "before:bg-background dark:before:bg-background",
                        ],
                    }}
                >
                    <Button 
                        isIconOnly 
                        className="text-2xl rounded-xl text-[#A1A1AA] bg-[#fff0] 
                        hover:bg-[#003db647] hover:text-[#639cff]"
                    >
                        <FaRegComments />
                    </Button>
                </Tooltip>

                <Tooltip 
                    placement="bottom" 
                    content="Share" 
                    className="bg-background z-10" 
                    showArrow 
                    classNames={{
                        base: [
                          // arrow color
                          "before:bg-background dark:before:bg-background",
                        ],
                    }}
                >
                    <Button 
                        isIconOnly 
                        className="text-2xl rounded-xl text-[#A1A1AA] bg-[#fff0] 
                        hover:bg-[#dd0dba3c] hover:text-[#DD0DB9]"
                    >
                        <TbShare3 />
                    </Button>
                </Tooltip>
            </div>   
        </div>     
                                                               
    </div>   
  )
}

