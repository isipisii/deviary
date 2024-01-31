import Link from "next/link";
import Image from "next/image";
import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="relative">
      <div className="absolute -right-[20rem] z-0 h-[500px] w-[500px] translate-y-[60%] overflow-hidden rounded-full bg-gradient-to-l from-[#dd0dba4d] to-[#ffffff18] blur-[70px] filter lg:h-[800px] lg:w-[800px]" />
      <div className="absolute -bottom-10 -left-[20rem] z-[0] h-[350px] w-[400px] rounded-full bg-gradient-to-l from-[#0d8add25] to-[#0d8add29] blur-[80px] filter lg:h-[700px] lg:w-[700px]" />
      
      {/* Hero Section */}
      <section className="relative flex h-[65vh] w-full items-center justify-center">
        {/* pattern */}
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#dd0dba64_1px,transparent_1px),linear-gradient(to_bottom,#dd0dba64_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <nav
          className="fixed left-1/2 top-4 z-40 w-[90%] max-w-[1200px] -translate-x-1/2 
          rounded-[2rem] border-2 border-[#42393962] p-4 backdrop-blur-sm backdrop-saturate-150 md:bg-background/60"
        >
          <header className="flex w-full items-center justify-between">
            <Image
              src="/images/deviary-dark.png"
              alt="logo"
              width={80}
              height={25}
            />

            <Button
              color="secondary"
              className="font-medium"
              size="sm"
              radius="lg"
            >
              Sign in
            </Button>
          </header>
        </nav>

        {/* Hero Section Container */}
        <div className="z-30 w-[90%] max-w-[1200px]">
          <h1 className="text-center text-[2.25rem] font-bold leading-tight md:text-[3.2rem] md:leading-none lg:text-[4.5rem]">
            <span className="">Where developers</span>
            <br />{" "}
            <span className="bg-gradient-to-b from-[#7334ca] to-[#DD0DB9] bg-clip-text text-transparent">
              write, read, keep, and explore.
            </span>
          </h1>
          <p className="mt-4 text-center text-xs text-[#7b7a7a] md:text-sm lg:text-base">
            Tech tales to tell,{" "}
            <span className="font-semibold text-white">code diaries</span> to
            swell.{" "}
            <span className="font-semibold text-white">Blog your tech</span>,
            let your code story excel.
          </p>
        </div>
      </section>

      <section className="flex w-full justify-center">
        {/* 2nd Section Container */}
        <div className="h-screen w-[90%] max-w-[1200px]">
          {/* Cards Container */}
          <div className="flex w-full items-center gap-4">
            <div className="h-[200px] w-full rounded-xl border-1 border-[#42393962] p-4 backdrop-blur-sm backdrop-saturate-150 md:bg-[#343434]/20"></div>
            <div className="h-[200px] w-full rounded-xl border-1 border-[#42393962] p-4 backdrop-blur-sm backdrop-saturate-150 md:bg-[#343434]/20"></div>
            <div className="h-[200px] w-full rounded-xl  border-1 border-[#42393962] p-4 backdrop-blur-sm backdrop-saturate-150 md:bg-[#343434]/20"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
