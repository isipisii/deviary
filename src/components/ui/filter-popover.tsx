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
import {
  useGetCurrentFeedFilter,
  useApplyFeedFilter,
  useGetCurrentGuildsFilter,
  useApplyGuildsFilter,
} from "@/lib/services/user.api";
import { useEffect, useState } from "react";

const feedRadioItems = [
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

const guildsRadioItems = [
  {
    value: "ALL",
    description: "All private and public guilds",
    label: "All",
  },
  {
    value: "PUBLIC",
    description: "Public guilds",
    label: "Public",
  },
  {
    value: "PRIVATE",
    description: "Private guilds",
    label: "Private",
  },
] as const;

export default function FilterPopover({
  type,
}: {
  type: "GUILDS" | "FEED_POSTS";
}) {
  // for feed posts
  const { data: currentFeedFilter, isLoading: isFeedFilterLoading } =
    useGetCurrentFeedFilter();
  const { mutate: applyFeedFilterMutation, isPending: isApplyingFeedFilter } =
    useApplyFeedFilter();
  const [selectedFeedFilter, setSelectedFeedFilter] = useState<TFeedFilter>(
    currentFeedFilter ?? "all",
  );

  // for guilds
  const { data: currentGuildsFilter, isLoading: isGuildsFilterLoading } =
    useGetCurrentGuildsFilter();
  const {
    mutate: applyGuildsFilterMutation,
    isPending: isApplyingGuildFilter,
  } = useApplyGuildsFilter();
  const [selectedGuildsFilter, setSelectedGuildsFilter] =
    useState<TGuildsFilter>(currentGuildsFilter ?? "ALL");

  const isPending = isApplyingFeedFilter || isApplyingGuildFilter;
  const radioItems = type === "FEED_POSTS" ? feedRadioItems : guildsRadioItems;

  //for setting the saved value after fetching the filter data 
  useEffect(() => {
    if (!isFeedFilterLoading && currentFeedFilter)
      setSelectedFeedFilter(currentFeedFilter);

    if (!isGuildsFilterLoading && currentGuildsFilter)
      setSelectedGuildsFilter(currentGuildsFilter);
  }, [
    isFeedFilterLoading,
    currentGuildsFilter,
    currentFeedFilter,
    isGuildsFilterLoading,
  ]);

  function handleApplyChanges() {
    if (type === "GUILDS") applyGuildsFilterMutation(selectedGuildsFilter);
    if (type === "FEED_POSTS") applyFeedFilterMutation(selectedFeedFilter);
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
            value={
              type === "FEED_POSTS" ? selectedFeedFilter : selectedGuildsFilter
            }
            onValueChange={(value) =>
              type === "FEED_POSTS"
                ? setSelectedFeedFilter(value as TFeedFilter)
                : setSelectedGuildsFilter(value as TGuildsFilter)
            }
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
