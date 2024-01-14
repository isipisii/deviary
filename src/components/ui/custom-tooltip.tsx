import { Tooltip } from "@nextui-org/react";
import { ReactNode } from "react";
import { TooltipPlacement } from "@nextui-org/react";

interface ICustomTooltip {
  children: ReactNode
  content: string
  placement?: TooltipPlacement
}
export default function CustomTooltip({ children, content, placement }: ICustomTooltip) {
  return (
    <Tooltip
      placement={placement}
      content={content}
      className="z-10 bg-background"
      showArrow
      classNames={{
        base: [
          // arrow color
          "before:bg-background dark:before:bg-background",
        ],
      }}
    >
      {children}
    </Tooltip>
  )
}
