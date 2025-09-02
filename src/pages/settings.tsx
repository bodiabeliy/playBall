import { useState } from 'react'

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { SidebarLayout } from '../shared'


import { SettingsNavigation } from '../widgets/settings-page/components/settings-navigation'
import { SettingsContent } from '../widgets/settings-page/components/settings-content'
import { SettingsNavigationMobile } from '../widgets/settings-page/components/settings-navigation/settings-navigation-mobile'

export default function SettingsPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallDesktop = useMediaQuery(theme.breakpoints.down(2000))


  const [activeTab, setActiveTab] = useState(0)
  const [activeTabMobile, setActiveTabMobile] = useState<number | null>(null)



  return (
    <SidebarLayout title="club settings">
      <Box
        sx={{
          maxWidth: 950,
          mx: 'auto',
          mt: isMobile ? 2 : 4,
          bgcolor: 'white',
          borderRadius: 3,
          p: isMobile ? 2 : 4,
          width: '100%',
        }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Edit your details and manage your settings here
        </Typography>
        {isMobile ? (
          <>
            {activeTabMobile === null && <SettingsNavigationMobile onTabChange={setActiveTabMobile} />}
            {activeTabMobile !== null ? <SettingsContent activeTab={activeTabMobile} /> : null}
          </>
        ) : (
         <Box
            sx={{ display: 'grid', gridTemplateColumns: isSmallDesktop ? '1fr' : '2fr 10fr', gap: '24px', mt: '16px' }}>
            <SettingsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            <SettingsContent activeTab={activeTab} />
          </Box>
        )}
      </Box>
    </SidebarLayout>
  )
}
 