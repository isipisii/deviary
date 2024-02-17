import {
  Avatar,
  AvatarGroup,
  User,
} from "@nextui-org/react";
import CustomTooltip from "./custom-tooltip";

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
        <CustomTooltip key={user.id} placement="bottom" content={
          <div className="flex gap-3 px-3 py-4 items-center ">
            <User
              avatarProps={{
                src: user?.image,
                isBordered: true
              }}
              classNames={{
                description: "text-navTextColor",
                name: "font-medium",
              }}
              className="transition-transform"
              description={user.email}
              name={user.name}
            />
          </div>
        }>
           <Avatar src={user.image} key={user.id} showFallback />
        </CustomTooltip>
      ))}
    </AvatarGroup>
  );
}