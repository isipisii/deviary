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
          <div className="px-2 py-3 max-w-[250px]">
            <div className="flex gap-3 flex-col flex-start">
              <User
                avatarProps={{
                  src: user?.image,
                  isBordered: true,
                  className: "h-[30px] w-[30px]"
                }}
                classNames={{
                  description: "text-navTextColor",
                  name: "font-medium",
                }}
                className="transition-transform w-[170px]"
                description={user.email}
                name={user.name}
              />
              <p className="">{user.bio}</p>
            </div>
           
          </div>
        }>
           <Avatar src={user.image} key={user.id} showFallback />
        </CustomTooltip>
      ))}
    </AvatarGroup>
  );
}