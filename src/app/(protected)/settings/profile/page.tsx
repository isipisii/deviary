import { db } from "@/lib/prisma";
import { getServerSideSession } from "@/lib/auth";
import ProfileForm from "./components/user-profile-form";

export default async function SettingsProfilePage() {
  const session = await getServerSideSession();

  const existingUser = await db.user.findUnique({
    where: {
      id: session?.user.id,
    },
    include: {
      social: {
        select: {
          facebook: true,
          github: true,
        },
      },
    },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  const { password, guildFilter, feedFilter, ...restUserFields } = existingUser;

  return (
    <div className="mt-4 w-[70%]">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-navTextColor">Profile</h3>
        <ProfileForm user={restUserFields as TUser} />
      </div>
    </div>
  );
}
