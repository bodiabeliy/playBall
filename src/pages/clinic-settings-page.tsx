import { useState } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { SettingsNavigation } from '../widgets/settings-page/components/settings-navigation'
import { SettingsContent } from '../widgets/settings-page/components/settings-content'
import { SidebarLayout } from '../shared'
import { SettingsNavigationMobile } from '../widgets/settings-page/components/settings-navigation/settings-navigation-mobile'

import { ClubSelector } from '../shared/components/ui/club-selector'
import { MOCK_CLUBS } from '../shared/components/layout/sidebar/model'

export function ClinicSettingsPage() {
  const [subtitle, setSubtitle] = useState('')
  const theme = useTheme()

  const isSmallDesktop = useMediaQuery(theme.breakpoints.down('lg'))
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [activeTab, setActiveTab] = useState(0)
  const [activeTabMobile, setActiveTabMobile] = useState<number | null>(null)

  return (
    <SidebarLayout
      title="Налаштування"
      subtitle={subtitle}
      rightSidebar={<ClubSelector clubs={MOCK_CLUBS} />}
      >
      {isMobile ? (
        <>
          {activeTabMobile === null && <SettingsNavigationMobile onTabChange={setActiveTabMobile} />}
          {activeTabMobile !== null ? <SettingsContent activeTab={activeTabMobile} setSubtitle={setSubtitle} /> : null}
        </>
      ) : (
        <Box
          sx={{ display: 'grid', gridTemplateColumns: isSmallDesktop ? '1fr' : '2fr 10fr', gap: '24px', mt: '16px' }}>
          <SettingsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <SettingsContent activeTab={activeTab} setSubtitle={setSubtitle} />
        </Box>
      )}
    </SidebarLayout>
  )
}
