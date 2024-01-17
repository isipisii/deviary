"use client";

import {
  Chip,
  Input,
  Button,
  Spinner,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { FormEvent, useEffect, useState } from "react";
import { useLayoutEffect } from "react";
import { useTags } from "@/lib/store/useTags";
import { IoClose } from "react-icons/io5";
import { useDebounce } from "use-debounce";
import { useSearchTags } from "@/lib/services/tag.api";

export default function Tags({ initialTags }: { initialTags?: string[] }) {
  const { tags, insertTag, removeTag, removeAllTags, setInitialTags } = useTags(
    (state) => state,
  );
  const [tag, setTag] = useState("");
  const [debounceTag] = useDebounce(tag, 1000);
  const { data: searchedTags, isLoading, refetch } = useSearchTags(debounceTag);
  const showRemoveAll = tags.length > 1;
  const showSearchedTags = searchedTags && searchedTags.length > 0 && tag

  useLayoutEffect(() => {
    if (initialTags && initialTags.length > 0) {
      setInitialTags(initialTags);
    } else setInitialTags([]);
  }, [initialTags, setInitialTags]);

  useEffect(() => {
    if (debounceTag) {
      refetch();
    }
  }, [debounceTag, refetch]);

  function handleInsertTag(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    insertTag(tag);
    setTag("");
  }

  function handleInsertSearchedTag(selectedTag: string) {
    const tagInput = document.getElementById("tag-input")
    
    insertTag(selectedTag);
    setTag("");
    tagInput?.focus()
  }

  return (
    <form onSubmit={handleInsertTag} className="flex flex-col gap-3">
      {tags.length > 0 && (
        <div className="flex max-w-[700px] flex-wrap gap-3">
          {tags.map((tag, index) => (
            <Chip
              onClose={() => removeTag(tag)}
              radius="full"
              size="lg"
              color="secondary"
              variant="dot"
              classNames={{
                base: "border-borderColor border-2",
              }}
              key={index}
            >
              {tag}
            </Chip>
          ))}
          {showRemoveAll && (
            <Button
              color="danger"
              variant="bordered"
              radius="full"
              size="sm"
              startContent={<IoClose />}
              onClick={removeAllTags}
              className="font-semibold"
            >
              Remove all
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Input
          labelPlacement="inside"
          label="Tag (optional)"
          radius="lg"
          id="tag-input"
          variant="bordered"
          size="sm"
          className="max-w-md"
          classNames={{
            label: "font-semibold",
            inputWrapper: "border-borderColor border-2 rounded-xl",
          }}
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          endContent={
            isLoading && (
              <Spinner
                size="sm"
                color="secondary"
                aria-label="Loading..."
                className="mb-2"
              />
            )
          }
        />
        {showSearchedTags && (
          <SearchedTags
            searchedTags={searchedTags}
            tags={tags}
            handleInsertSearchedTag={handleInsertSearchedTag}
          />
        )}
      </div>
    </form>
  );
}

interface ISearchedTags {
  searchedTags: { tagName: string }[];
  tags: string[];
  handleInsertSearchedTag: (tag: string) => void;
}

function SearchedTags({
  searchedTags,
  tags,
  handleInsertSearchedTag,
}: ISearchedTags) {
  return (
    <div className="w-full max-w-md rounded-xl border-2 border-borderColor p-1 ">
      <Listbox
        aria-label="Single selection"
        variant="flat"
        selectedKeys={tags}
        selectionMode="single"
      >
        {searchedTags.map(({ tagName }) => (
          <ListboxItem
            key={tagName}
            className="rounded-lg"
            onClick={() => handleInsertSearchedTag(tagName)}
          >
            {tagName}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
}
