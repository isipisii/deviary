import Link from "next/link";
import { TbError404 } from "react-icons/tb";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center justify-between gap-4">
        <p className="text-center text-[15rem] text-secondary">
          <TbError404 />{" "}
        </p>
        <div>
          <h2 className="text-center text-[2rem] font-black">Not Found</h2>
          <p className="text-center text-navTextColor">Nothing to see here.</p>
        </div>
        <Link href="/feed">
          <p className="hover:bg-secondary/20 transition ease-in-out duration-500 rounded-md px-4 py-2 font-semibold text-secondary">
            Go to feed instead?
          </p>
        </Link>
      </div>
    </div>
  );
}
