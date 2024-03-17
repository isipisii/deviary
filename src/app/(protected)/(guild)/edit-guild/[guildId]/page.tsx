import PageTitle from "@/components/ui/page-title";
import React from "react";
import GuildForm from "../../components/guild-form";
import { getGuildById } from "@/lib/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deviary | Edit guild",
  description: `a developer's diary and community`,
};

export default async function EditGuild({ params }: { params: { guildId: string } }) {
  const guildToEdit = await getGuildById(params.guildId)

  return (
    <div className="flex w-full items-center justify-center p-6 md:p-12">
      <div className="flex w-full max-w-[900px] flex-col gap-8">
        <PageTitle>Edit Guild</PageTitle>
        <GuildForm isEditing={true} guildToEdit={guildToEdit} />
      </div>
    </div>
  );
}
