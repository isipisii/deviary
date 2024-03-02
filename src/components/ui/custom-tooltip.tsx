import { Tooltip } from "@nextui-org/react";
import { ReactNode } from "react";
import { TooltipPlacement } from "@nextui-org/react";
import { cn } from "@/utils/cn";

interface ICustomTooltip {
  children: ReactNode
  content:  ReactNode
  placement?: TooltipPlacement
}
export default function CustomTooltip({ children, content, placement }: ICustomTooltip) {
  return (
    <Tooltip
      placement={placement}
      content={content}
      className="z-10 bg-cardBg rounded-2xl"
      showArrow
      offset={10}
      classNames={{
        base: [
          // arrow color
          "before:bg-cardBg dark:before:bg-cardBg",
        ],
      }}
    >
      {children}
    </Tooltip>
  )
}
