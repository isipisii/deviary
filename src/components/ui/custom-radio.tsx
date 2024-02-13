import { Radio, RadioProps } from "@nextui-org/react";
import { cn } from "@/utils/cn";

export function CustomRadio({ children, ...otherProps }: RadioProps) {
  return (
    <Radio
      {...otherProps}
      classNames={{
        description: "text-navTextColor",
        label: "font-semibold",
        base: cn(
          "m-0 items-center",
          "max-w-[400px] cursor-pointer rounded-xl gap-4 px-4 py-2 border-2 border-transparent",
          "data-[selected=true]:border-secondary data-[selected=true]:bg-secondary/5",
        ),
      }}
    >
      {children}
    </Radio>
  );
}
