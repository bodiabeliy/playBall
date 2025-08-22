import { TabPanel } from '../../../../shared/components/ui/tab-panel'
import { ClubArenaForm, ClubLocationForm, ClubHourForm, ClubAmenitiesForm } from '../../../../features/settings-profile'


interface SettingsContentProps {
  activeTab: number
}

export function SettingsContent({ activeTab }: SettingsContentProps) {
  return (
    <>
      <TabPanel value={activeTab} index={0}>
        <ClubArenaForm  />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <ClubLocationForm  />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <ClubHourForm  />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <ClubAmenitiesForm  />
      </TabPanel>
    </>
  )
}
