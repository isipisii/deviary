"use client";

import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { FiFilter } from "react-icons/fi";
import { useGetCurrentFeedFilter, useApplyFeedFilter } from "@/lib/services/user.api";
import { useEffect, useState } from "react";

const radioItems = [
  {
    value: "all",
    description: "All posts that has been posted",
    label: "All",
  },
  {
    value: "blog_post",
    description: "Posts that were posted as blog",
    label: "Blog post",
  },
  {
    value: "code_diary",
    description: "Posts that were posted as code diary",
    label: "Code diary",
  },
] as const;


export default function FilterPopover() {
  const { data: currentFeedFilter, isLoading } = useGetCurrentFeedFilter()
  const { mutate: applyFeedFilterMutation, isPending } = useApplyFeedFilter()
  const [selected, setSelected] = useState<TFeedFilter>(currentFeedFilter ?? "all")

  useEffect(() => {
    if(!isLoading && currentFeedFilter) setSelected(currentFeedFilter)
  },[isLoading, currentFeedFilter])

  function handleApplyChanges() {
    applyFeedFilterMutation(selected)
  }

  return ( 
    <Popover
      placement="bottom-end"
      classNames={{
        content: ["bg-background p-4", "rounded-xl border border-borderColor"],
      }}
    >
      <PopoverTrigger>
        <Button
          variant="bordered"
          size="md"
          className="z-[5] rounded-xl border-1 border-borderColor text-[1rem]"
          startContent={<FiFilter />}
        >
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4">
          <div className="text-base font-semibold">Filter</div>
          <RadioGroup
            color="secondary"
            value={selected}
            onValueChange={(value ) => setSelected(value as TFeedFilter)}
            className="flex flex-col gap-3"
          >
            {radioItems.map((radioItem, index) => (
              <Radio
                key={index}
                value={radioItem.value}
                description={radioItem.description}
                classNames={{
                  description: "text-navTextColor text-xs ",
                  label: "text-sm",
                  base: "py-3",
                }}
              >
                {radioItem.label}
              </Radio>
            ))}
          </RadioGroup>

          <Button
            color="secondary"
            size="sm"
            className="rounded-lg font-semibold text-white"
            onClick={handleApplyChanges}
            isLoading={isPending}
          >
            Apply changes
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
