"use client";
import ProfileDetails from "./profile-details";
import { useGetUserById } from "@/lib/services/user.api";
import { useParams } from "next/navigation";
import UserProfileTabs from "./user-profile-tabs";

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const { data } = useGetUserById(userId);
  // TODO: CREATE A UI FOR UPDATING THE USER PROFILE
  return (
    <div className="w-full flex flex-col gap-4">
      {/* profile details */}
      {data && <ProfileDetails user={data} />}
      {/* user posts and upvotes */}
      <UserProfileTabs />
    </div>
  );
}
