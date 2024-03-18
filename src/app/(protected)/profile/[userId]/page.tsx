import { Metadata } from "next";
import { db } from "@/lib/prisma";
import Profile from "../components/profile";
import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/constants";
import { getUserById } from "@/lib/services/user.api";

export async function generateMetadata({
  params: { userId },
}: {
  params: { userId: string };
}): Promise<Metadata> {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  return {
    title: `Deviary | ${user?.name}`,
    description: `a developer's diary and community`,
  };
}

export default async function ProfilePage({ params: { userId } }: { params: { userId: string }}) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.User, userId],
    queryFn: () => getUserById(userId)
  })

  return (
    <div className="flex w-full items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-[900px]">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Profile />
        </HydrationBoundary>
      </div>
    </div>
  );
}
