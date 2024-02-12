import { getGuildById } from "@/lib/actions"
import Guild from "../../components/guild"

export default async function GuildPage({ params }: { params: { guildId: string }}) {
  const guild = await getGuildById(params.guildId)

  return (
   <Guild guild={guild}/>
  )
}
