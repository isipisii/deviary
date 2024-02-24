"use client";

import CustomTooltip from "@/components/ui/custom-tooltip";
import { cn } from "@/utils/cn";
import { Button } from "@nextui-org/react";
import { FaRegComments } from "react-icons/fa6";
import { TbArrowBigUp, TbArrowBigUpFilled, TbShare3 } from "react-icons/tb";

export default function CommentActions() {
  return (
    <div className="flex gap-12 items-center">
      <div className="flex items-center gap-1">
        <CustomTooltip placement="bottom" content="Upvote">
          <Button
            isIconOnly
            className={cn(
              `rounded-xl bg-[#fff0] text-xl text-[#A1A1AA]
           hover:bg-[#34b6003b] hover:text-[#34FF00]`,
              {
                "text-[#34FF00]": true,
                "text-[#A1A1AA]": false,
              },
            )}
            onClick={(e) => {
              e.preventDefault();
              e.nativeEvent.stopImmediatePropagation();
            }}
          >
            {true ? <TbArrowBigUpFilled /> : <TbArrowBigUp />}
          </Button>
        </CustomTooltip>
        <p className="font-bold text-[#A1A1AA]">0</p>
      </div>

      <CustomTooltip placement="bottom" content={"Reply"}>
        <Button
          isIconOnly
          className={cn(
            `rounded-xl bg-[#fff0] text-xl text-[#A1A1AA] 
        hover:bg-[#003db647] hover:text-[#639cff]`,
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <FaRegComments />
        </Button>
      </CustomTooltip>
    </div>
  );
}
