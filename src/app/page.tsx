import Image from "next/image";
import { Button } from "@nextui-org/react";
import { LuUsers2 } from "react-icons/lu";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-[#00060C]">
      {/* Hero Section */}
      <section className="relative flex h-[80vh] w-full items-center justify-center">
        {/* pattern */}
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#dd0dba64,transparent_1px),linear-gradient(to_bottom,#dd0dba64,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_0%,#000_80%,transparent_110%)]" />
        <nav
          className="fixed left-1/2 top-4 z-40 w-[90%] max-w-[1200px] -translate-x-1/2 
          rounded-3xl border-2 border-[#42393962] px-4 py-3 backdrop-blur-sm backdrop-saturate-150 md:bg-[#00060C]/80"
        >
          <header className="flex w-full items-center justify-between">
            <Image
              src="/images/deviary-dark.png"
              alt="logo"
              width={80}
              height={25}
            />

            <div className="flex gap-4">
              <Button
                as={Link}
                href="/sign-in"
                color="secondary"
                className="font-medium"
                variant="light"
                radius="lg"
              >
                Sign in
              </Button>

              <Button
                as={Link}
                href="/sign-up" 
                color="secondary"
                className="font-medium text-white"
                radius="lg"
              >
                Create an account
              </Button>
            </div>
          </header>
        </nav>

        {/* Hero Section Container */}
        <div className="z-30 w-[90%] max-w-[1200px] pt-4">
          <h1 className="text-center text-[2.3rem] font-bold leading-tight md:text-[3.2rem] md:leading-none lg:text-[4rem] 2xl:text-[4.5rem]">
            <span className="text-white">Where developers</span>
            <br />{" "}
            <span className="bg-gradient-to-b from-[#7334ca] to-[#DD0DB9] bg-clip-text text-transparent">
              write, read, keep, and explore.
            </span>
          </h1>
          {/* <p className="mt-4 text-center text-[#ECEDEE]/80">
            Tech tales to tell,{" "}
            <span className="font-semibold text-white">code diaries</span> to
            swell.{" "}
            <span className="font-semibold text-white">Blog your tech</span>,
            let your code story excel.
          </p> */}
        </div>
      </section>

      <section className="relative flex w-full justify-center py-[4rem]">
        <div className="absolute right-0 top-0 z-0 h-[350px] w-[300px] rounded-bl-[8rem] rounded-tl-[8rem] bg-gradient-to-l from-[#dd0dba2f] to-[#dd0dc125] blur-[70px] filter md:h-[500px] md:w-[450px]" />
        <div className="absolute -bottom-10 -left-[18rem] z-0  h-[500px] w-[500px]  rounded-full bg-gradient-to-l from-[#0d8add25] to-[#0d8add29] blur-[80px] filter md:h-[600px] md:w-[600px]" />
        {/* 2nd Section Container */}
        <div className=" w-[90%] max-w-[1200px]">
          {/* Cards Container */}
          <div className="flex w-full flex-wrap items-center justify-center gap-4">
            <div className="relative  h-[140px] w-full overflow-hidden rounded-xl border-1 border-[#42393962] bg-[#343434]/20 backdrop-blur-sm backdrop-saturate-150 md:h-[160px] md:w-[40%] lg:w-[30%]">
              <p className="absolute -bottom-2 -right-[1rem] z-0 -rotate-45 text-[5rem] text-[#807f7f]">
                <LuUsers2 />
              </p>

              <div className="absolute left-5 top-5 z-20 h-full w-[90%] space-y-1 ">
                <p className="text-[1.1rem] font-bold text-[#ECEDEE]">
                  Community
                </p>
                <p className="text-sm leading-10  text-[#9c9999]">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum
                  non tempora vero! Aliquid soluta. Eum non tempora vero!
                  Aliquid soluta.
                </p>
              </div>
            </div>

            <div className="relative h-[140px] w-full overflow-hidden rounded-xl border-1 border-[#42393962] bg-[#343434]/20 backdrop-blur-sm backdrop-saturate-150 md:h-[160px] md:w-[40%] lg:w-[30%]">
              <p className="absolute -bottom-2 -right-[1rem] z-0 -rotate-45 text-[5rem] text-[#807f7f]">
                <LuUsers2 />
              </p>

              <div className="absolute left-5 top-5 z-20 h-full w-[90%] space-y-1 ">
                <p className="text-[1.1rem] font-bold text-[#ECEDEE]">
                  Community
                </p>
                <p className="text-sm leading-10  text-[#9c9999]">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum
                  non tempora vero! Aliquid soluta. Eum non tempora vero!
                  Aliquid soluta.
                </p>
              </div>
            </div>

            <div className="relative h-[140px] w-full overflow-hidden rounded-xl border-1 border-[#42393962] bg-[#343434]/20 backdrop-blur-sm backdrop-saturate-150 md:h-[160px] md:w-[40%] lg:w-[30%]">
              <p className="absolute -bottom-2 -right-[1rem] z-0 -rotate-45 text-[5rem] text-[#807f7f]">
                <LuUsers2 />
              </p>

              <div className="absolute left-5 top-5 z-20 h-full w-[90%] space-y-1 ">
                <p className="text-[1.1rem] font-bold text-[#ECEDEE]">
                  Community
                </p>
                <p className="text-sm leading-10  text-[#9c9999]">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum
                  non tempora vero! Aliquid soluta. Eum non tempora vero!
                  Aliquid soluta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="h-[500px]"></section>

      <footer></footer>
    </main>
  );
}
