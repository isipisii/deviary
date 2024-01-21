import PageTitle from "@/components/ui/page-title";
import { Input } from "@nextui-org/react";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function SearchPage() {
  return (
    <div className="p-6 md:p-12">
      <div className="flex gap-4 flex-col">
        <PageTitle>Search</PageTitle>
        <Input
          labelPlacement="inside"
          label="Find posts that interests you"
          radius="lg"
          variant="bordered"
          size="sm"
          className="max-w-md"
          classNames={{
            label: "font-semibold",
            inputWrapper: "border-borderColor border-2 rounded-xl",
          }}
          // value={tag}
          // onChange={(e) => setTag(e.target.value)}
          endContent={
            <FaMagnifyingGlass className="mb-[.6rem] text-navTextColor" />
          }
        />
      </div>
    </div>
  );
}
