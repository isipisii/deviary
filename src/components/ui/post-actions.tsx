import { Tooltip, Button } from '@nextui-org/react'
import React from 'react'
import { FaRegComments } from 'react-icons/fa'
import { TbArrowBigUp, TbShare3 } from 'react-icons/tb'

export default function PostActions() {
  return (
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
  )
}   
