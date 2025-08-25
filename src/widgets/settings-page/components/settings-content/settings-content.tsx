import { TabPanel } from '../../../../shared/components/ui/tab-panel'
import { ClubArenaForm, SecurityForm, CancellationPolicyForm, AccessControlForm, LightingManagementForm } from '../../../../features/settings-profile'


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
        <SecurityForm  />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <CancellationPolicyForm  />
      </TabPanel>
      <TabPanel value={activeTab} index={3}>
        <AccessControlForm  />
      </TabPanel>
      <TabPanel value={activeTab} index={4}>
        <LightingManagementForm  />
      </TabPanel>
    </>
  )
}
