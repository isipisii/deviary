/* eslint-disable @next/next/no-img-element */
import { Button } from "@nextui-org/react";
import { FiFilter } from "react-icons/fi";
import FeedContainer from "./components/feed-container";
import { getServerSideSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Feed() {
  // const session = await getServerSideSession()

  // const user = await db.user.findFirst({
  //   where: {
  //     id: session?.user.id
  //   }
  // })

  // if(user) {
  //   if(!user.onboarded) {
  //     redirect("/onboarding")
  //   }
  // }
  return (
    <main className="p-12">
        <div className="flex items-center justify-between">
            <h2 className="font-semibold text-3xl" >Feed</h2>
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
    </main>
  )
}


