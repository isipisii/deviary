import PageTitle from "@/components/ui/page-title";
import GuildForm from "../components/guild-form";

export default function NewGuild() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-12">
      <div className="flex w-full max-w-[900px] flex-col gap-8">
        <PageTitle>Create a new Guild</PageTitle>
        <GuildForm />
      </div>
    </div>
  );
}
