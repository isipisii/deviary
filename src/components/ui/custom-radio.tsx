import { Radio, RadioProps } from "@nextui-org/react";
import { cn } from "@/utils/cn";

export function CustomRadio({ children, ...otherProps }: RadioProps) {
  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "m-0 items-center",
          "max-w-[300px] cursor-pointer rounded-xl gap-4 p-2 border-2 border-transparent",
          "data-[selected=true]:border-secondary data-[selected=true]:bg-secondary/5",
        ),
      }}
    >
      {children}
    </Radio>
  );
}
