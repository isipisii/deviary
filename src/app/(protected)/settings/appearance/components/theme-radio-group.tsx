"use client";

import { CustomRadio } from "@/components/ui/custom-radio";
import { RadioGroup } from "@nextui-org/react";
import { useTheme } from "next-themes";

export default function ThemeRadioGroup() {
  const { theme, setTheme } = useTheme();

  return (
    <RadioGroup value={theme} onValueChange={setTheme} className="z-[5]">
      <CustomRadio value="light" size="sm" color="secondary">
        Light
      </CustomRadio>
      <CustomRadio value="dark" size="sm" color="secondary">
        Dark
      </CustomRadio>
      <CustomRadio value="system" size="sm" color="secondary">
        System
      </CustomRadio>
    </RadioGroup>
  );
}
