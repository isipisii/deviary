import formatDate from '@/utils/formatDate'
import React from 'react'
import { TbArrowBigUpFilled } from 'react-icons/tb'

export default function UpvoteNotificationCard() {

  return (
    <div className="flex gap-3 py-3">
    <div className="relative h-[45px] w-[45px] rounded-full">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvP-MynRgvTDJw3MGfnb4E6BvL9QAWdRlP1ZIGdGeAlA&s"
        alt="try"
        className="w-full rounded-full"
      />
      <p className="absolute bottom-0 right-0 text-[1.1rem] text-[#34FF00]">
        <TbArrowBigUpFilled />
      </p>
    </div>

    <div className="flex w-full flex-col gap-3">
      <p className="text-sm">
        <span className="font-semibold">Alessandro Benig</span>{" "}
        <span className="text-navTextColor">
          upvoted your post
        </span>
      </p>
      <div className="flex items-center gap-2 rounded-lg border border-borderColor p-3">
        <img
          src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*th9ZIzkFpStwIUi4DIp8Ag.png"
          alt="try"
          className="h-[50px] w-[90px] rounded-md object-cover"
        />
        {/* post title */}
        <p className="text-sm">
          Recap of Next.js Conf 2023 and v14 release
        </p>
      </div>
      <p className="self-end text-xs text-navTextColor">
        {formatDate(new Date())}
      </p>
    </div>
  </div>
  )
}
