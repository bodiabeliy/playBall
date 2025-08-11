import { useState } from 'react'
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { SettingsNavigation } from '../widgets/settings-page/components/settings-navigation'
import { SettingsContent } from '../widgets/settings-page/components/settings-content'
import { SidebarLayout } from '../shared'
import { SettingsNavigationMobile } from '../widgets/settings-page/components/settings-navigation/settings-navigation-mobile'
import MoreVerticalIcon from '../shared/assets/icons/more-vertical.svg?react'
import BellIcon from '../shared/assets/icons/bell.svg?react'

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
      rightSidebar={
        <>
          <IconButton
            sx={{
              background: '#f5f7fe',
              border: '1px solid rgba(0, 41, 217, 0.3)',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
            }}
            onClick={() => {
              setActiveTabMobile(null)
            }}>
            <MoreVerticalIcon style={{ color: '#8a4bdc' }} />
          </IconButton>
          <IconButton
            sx={{
              background: '#8a4bdc',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
            }}>
            <BellIcon style={{ color: 'white' }} />
          </IconButton>
        </>
      }>
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
