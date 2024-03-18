import GuildJoinRequestsModal from '@/app/(protected)/(guild)/components/join-requests/guild-join-requests-modal'
import GuildMembersModal from '@/app/(protected)/(guild)/components/members/guild-members-modal'
import { ReactNode } from 'react'

export default function GuildModalsProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <GuildMembersModal />
      <GuildJoinRequestsModal />
      {children}
    </>
  )
}
