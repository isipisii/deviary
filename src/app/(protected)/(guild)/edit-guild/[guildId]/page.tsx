import PageTitle from "@/components/ui/page-title";
import React from "react";
import GuildForm from "../../components/guild-form";

export default function EditGuild({ params }: { params: { guildId: string } }) {
  // TODO: FETCH THE GUILD TO EDIT
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-12">
      <div className="flex w-full max-w-[900px] flex-col gap-8">
        <PageTitle>Edit Guild</PageTitle>
        <GuildForm />
      </div>
    </div>
  );
}
