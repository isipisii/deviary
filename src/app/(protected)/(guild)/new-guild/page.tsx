import PageTitle from "@/components/ui/page-title";
import GuildForm from "../components/guild-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deviary | New guild",
  description: `a developer's diary and community`,
};

export default function NewGuild() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-12">
      <div className="flex w-full max-w-[900px] flex-col gap-8 z-[5]">
        <PageTitle>Create a new Guild</PageTitle>
        <GuildForm />
      </div>
    </div>
  );
}
