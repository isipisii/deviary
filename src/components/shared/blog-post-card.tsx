/* eslint-disable @next/next/no-img-element */
"use client"

import truncateString from "@/utils/truncateString"
import { Button } from "@nextui-org/react"
import { useSession } from "next-auth/react"
import { TbArrowBigUp, TbArrowBigUpFilled, TbShare3 } from "react-icons/tb";
import { Avatar } from "@nextui-org/react";
import { FaRegComments } from "react-icons/fa";

export default function BlogPostCard() {
  const { data } = useSession()

  return (
    <div className="relative h-[400px] w-[300px] rounded-2xl border-2 border-borderColor">
        {/* image and bg gradient */}
        <img 
            // src={index % 2 === 0 ? "https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/c9351b4fa8cdb6f53a50c523baf7965e?_a=AQAEufR" : "/images/nxt.png"}
            src={"https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/c9351b4fa8cdb6f53a50c523baf7965e?_a=AQAEufR"}
            alt="basta" 
            className="w-full h-full object-cover rounded-2xl"
        />
        <div 
            className="w-full absolute bottom-0 rounded-b-2xl h-full bg-gradient-to-t from-[#0C1319]
            via-[#0c1319b6] to-[#24253300]"
        />
        
        {/* blog details */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] flex justify-center flex-col gap-2">
            <div className='grid gap-1'>
                <Avatar
                    src={data?.user.image as string}
                    className="h-[40px] w-[40px]"
                />
                <h3 className="font-bold text-xl text-white">{truncateString("Recap of NextJS Conf 2023 and v14 release.")}</h3>
            </div>
            <div>
                <p className="text-sm text-[#A1A1AA]">Yesterday</p>
            </div>
            {/* blog actions */}
            <div className="flex items-center justify-between">
                <Button isIconOnly className="text-2xl rounded-xl text-[#A1A1AA] bg-[#fff0] hover:bg-[#34b60058] hover:text-[#34FF00]">
                    <TbArrowBigUp /> 
                </Button>
                <Button isIconOnly className="text-2xl rounded-xl text-[#A1A1AA] bg-[#fff0] hover:bg-[#003db647] hover:text-[#639cff]">
                    <FaRegComments />
                </Button>
                <Button isIconOnly className="text-2xl rounded-xl text-[#A1A1AA] bg-[#fff0] hover:bg-[#dd0dba3c] hover:text-[#DD0DB9]">
                    <TbShare3 />
                </Button>
            </div>   
        </div>     
                                                               
    </div>   
  )
}

