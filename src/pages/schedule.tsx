import { ScheduleMain, SchedulePopups } from '../features/schedule'
import { SidebarLayout } from '../shared'
import { useState } from 'react'
import { SettingsModal } from '../features/settings'
import { ClubSelector } from '../shared/components/ui/club-selector'
import { MOCK_CLUBS } from '../shared/components/layout/sidebar'

export function SchedulePage() {
  const [openSettingsModal, setOpenSettingsModal] = useState(false)
  return (
    <SidebarLayout
      title="Розклад"
      rightSidebar={<ClubSelector clubs={MOCK_CLUBS} />}
      >
      <ScheduleMain />
      <SchedulePopups />
      <SettingsModal open={openSettingsModal} onClose={() => setOpenSettingsModal(false)} />
    </SidebarLayout>
  )
}
