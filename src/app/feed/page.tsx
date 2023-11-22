/* eslint-disable @next/next/no-img-element */
import { Button } from "@nextui-org/react";
import { FiFilter } from "react-icons/fi";
import { getServerSideSession } from "@/lib/auth";
import truncateString from "@/utils/truncateString";

export default async function Feed() {
  const session = await getServerSideSession()

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

        <div className="w-full flex items-center justify-center">
            <div className="flex gap-12 flex-wrap mt-8">
                {[...new Array(10)].map((_, index) => (
                <div className="relative h-[350px] w-[280px] rounded-2xl border-2 border-borderColor" key={index}>
                        <img 
                            src={index % 2 === 0 ? "https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/c9351b4fa8cdb6f53a50c523baf7965e?_a=AQAEufR" : "/images/nxt.png"}
                            alt="basta" 
                            className="w-full h-full object-cover rounded-2xl"
                        />
                        <div 
                            className="w-full absolute bottom-0 rounded-b-2xl h-full bg-gradient-to-t from-[#0C1319]
                            via-[#1c2730c2] to-[#24253300]"
                        />

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%] flex justify-center flex-col gap-2">
                            <div className='grid gap-1'>
                                <img 
                                    src={session?.user.image ?? ""} 
                                    alt="basta" 
                                    className=" object-cover rounded-full h-[30px] w-[30px]"
                                />
                                <h3 className="font-bold text-xl text-white">{truncateString("Recap of NextJS Conf 2023 and v14 release.")}</h3>
                            </div>
                            <div>
                                <p className="text-sm text-[#A1A1AA]">Yesterday</p>
                            </div>
                        </div>      
                </div>     
                ))}
            </div>
        </div>
    </main>
  )
}


