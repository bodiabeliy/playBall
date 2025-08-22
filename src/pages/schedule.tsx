import { ScheduleMain, SchedulePopups } from '../features/schedule'
import { SidebarLayout } from '../shared'
import { useState } from 'react'
import { SettingsModal } from '../features/settings'


export function SchedulePage() {
  const [openSettingsModal, setOpenSettingsModal] = useState(false)
  return (
    <SidebarLayout
      title="Розклад"
      >
      <ScheduleMain />
      <SchedulePopups />
      <SettingsModal open={openSettingsModal} onClose={() => setOpenSettingsModal(false)} />
    </SidebarLayout>
  )
}
