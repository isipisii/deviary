"use client";

import { useAcceptJoinRequest, useDeclineJoinRequest } from "@/lib/services/guild.api";
import formatDate from "@/utils/formatDate";
import { Avatar, Button } from "@nextui-org/react";
import Link from "next/link";

export default function JoinRequestCard({
  joinRequest,
}: {
  joinRequest: TJoinRequest;
}) {
  const { id, sender, createdAt, guildId } = joinRequest;

  const { mutate: acceptJoinRequestMutation, isPending: isAccepting } =
    useAcceptJoinRequest();
  const { mutate: declineJoinRequestMutation, isPending: isDeclining } =
    useDeclineJoinRequest();

  return (
    <div className="flex w-full items-center justify-between gap-8 py-3">
      <div className="flex items-center gap-3">
        <Avatar src={sender.image} isBordered className="h-[35px] w-[35px]" />
        <div>
          <p className="text-[.8rem] md:text-[.93rem]">
            <Link href={`/profile/${sender.id}`} className="font-semibold">
              {sender.name}
            </Link>{" "}
            <span className="text-navTextColor">wants to join the guild</span>
          </p>
          <div className="flex flex-col">
            <p className="text-[.7rem] font-bold text-navTextColor">
              {formatDate(createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          isLoading={isAccepting}
          variant="solid"
          color="secondary"
          onClick={() =>
            acceptJoinRequestMutation({
              joinRequestId: joinRequest.id,
              guildId: joinRequest.guildId,
            })
          }
          className="text-white"
          size="sm"
          radius="lg"
        >
          Accept
        </Button>
        <Button
          isLoading={isDeclining}
          variant="bordered"
          onClick={() => declineJoinRequestMutation( {joinRequestId: id, guildId })}
          size="sm"
          radius="lg"
          className="border-2 border-borderColor"
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
