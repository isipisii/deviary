"use client";

import { Input } from "@nextui-org/react";
import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function SearchField() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleSearchTerm(term: string) {
    const params = new URLSearchParams(searchParams);
    const encodedSearchTerm = encodeURI(term);

    if (term) {
      params.set("query", encodedSearchTerm);
    } else {
      params.delete("query");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Input
      placeholder="Find posts that interests you"
      radius="lg"
      variant="bordered"
      size="sm"
      className="z-[5] max-w-md"
      classNames={{
        label: "font-semibold",
        inputWrapper: "border-borderColor border-2 rounded-xl",
      }}
      // value={tag}
      onChange={(e) => handleSearchTerm(e.target.value)}
      endContent={<FaMagnifyingGlass className="text-navTextColor" />}
    />
  );
}
