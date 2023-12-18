/* eslint-disable @next/next/no-img-element */
import { Button } from "@nextui-org/react";
import { FiFilter } from "react-icons/fi";
import FeedContainer from "./components/feed-container";

export default async function Feed() {
  return (
    <div className="p-12">
        <div className="flex items-center justify-between">
            <h2 className="font-semibold text-3xl">Feed</h2>
            <Button 
                variant="bordered" 
                size="md"
                className="border-borderColor border-1 rounded-xl text-[1rem]" 
                startContent={<FiFilter />}
            >
                Filter
            </Button>
        </div>
        <FeedContainer />
    </div>
  )
}


