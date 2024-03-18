"use client";
import ProfileDetails from "./profile-details";
import { useGetUserById } from "@/lib/services/user.api";
import { useParams } from "next/navigation";

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const { data } = useGetUserById(userId);
  // TODO: CREATE A UI FOR UPDATING THE USER PROFILE
  return (
    <div className="h-screen w-full">
      {/* profile details */}
      {data && <ProfileDetails user={data} />}
      {/* user posts and upvotes */}
      <div></div>
    </div>
  );
}
