import { TabPanel } from '../../shared/components/ui/tab-panel'

import { CourtsManagment } from '../../features/settings-workers/components/workers-management'



interface CourtContentProps {
  activeTab: number
}

export function CourtsContent({ activeTab }: CourtContentProps) {
  return (
    <>
      <TabPanel value={activeTab} index={0}>
        <CourtsManagment  />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <CourtsManagment  />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <CourtsManagment  />
      </TabPanel>
    </>
  )
}
