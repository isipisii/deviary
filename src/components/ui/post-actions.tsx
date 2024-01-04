import { Tooltip, Button } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";
import { FaRegComments } from "react-icons/fa";
import { TbArrowBigUp, TbShare3 } from "react-icons/tb";

export default function PostActions({ postId }: { postId: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <Tooltip
        placement="bottom"
        content="Upvote"
        className="z-10 bg-background"
        showArrow
        classNames={{
          base: [
            // arrow color
            "before:bg-background dark:before:bg-background",
          ],
        }}
      >
        <Button
          isIconOnly
          className="rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA] 
                hover:bg-[#34b60058] hover:text-[#34FF00]"
        >
          <TbArrowBigUp />
        </Button>
      </Tooltip>

      <Tooltip
        placement="bottom"
        content="Comments"
        className="z-10 bg-background"
        showArrow
        classNames={{
          base: [
            // arrow color
            "before:bg-background dark:before:bg-background",
          ],
        }}
      >
        <Button
          isIconOnly
          className="rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA] 
                hover:bg-[#003db647] hover:text-[#639cff]"
          onClick={() => router.push(`/post/${postId}`)}
        >
          <FaRegComments />
        </Button>
      </Tooltip>

      <Tooltip
        placement="bottom"
        content="Share"
        className="z-10 bg-background"
        showArrow
        classNames={{
          base: [
            // arrow color
            "before:bg-background dark:before:bg-background",
          ],
        }}
      >
        <Button
          isIconOnly
          className="rounded-xl bg-[#fff0] text-2xl text-[#A1A1AA] 
                hover:bg-[#dd0dba3c] hover:text-[#DD0DB9]"
        >
          <TbShare3 />
        </Button>
      </Tooltip>
    </div>
  );
}
