import { Avatar, AvatarGroup } from "@nextui-org/react";
import React from "react";

export default function CustomAvatarGroup({
  members,
  totalMembersCount,
}: {
  totalMembersCount: number;
  members: { user: TUser }[];
}) {
  return (
    <AvatarGroup
      max={5}
      total={totalMembersCount - 5}
      size="sm"
      renderCount={(count) => (
        <p className="ms-2 text-xs font-medium text-foreground">
          +{count} others
        </p>
      )}
      className="self-end"
      isBordered
    >
      {members.map(({ user }) => (
        <Avatar src={user.image ?? ""} key={user.id} showFallback />
      ))}
    </AvatarGroup>
  );
}
