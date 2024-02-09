import { Chip } from "@nextui-org/react";
import Link from "next/link";

export default function PostTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Link href={`/tag/${tag}`} key={index + tag}>
          <Chip
            radius="full"
            size="md"
            color="secondary"
            variant="flat"
            classNames={{
              base: "border-none font-semibold",
            }}
            key={index}
          >
            #{tag}
          </Chip>
        </Link>
      ))}
    </div>
  );
}
