import { Chip } from "@nextui-org/react";

export default function PostTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
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
      ))}
    </div>
  );
}
