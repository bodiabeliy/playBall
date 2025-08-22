import { Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'

import { TabLabel } from '../../../../shared/components/ui/tab-label'

interface SettingsNavigationProps {
  activeTab: number
  onTabChange: (newValue: number) => void
}

export function SettingsNavigation({ activeTab, onTabChange }: SettingsNavigationProps) {
  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Tabs
      value={activeTab}
      onChange={(_, newValue) => {
        onTabChange(newValue)
      }}
      variant="scrollable"
      orientation={!isTablet ? 'horizontal' : 'vertical'}
      sx={{
        '& .MuiTabs-flexContainer': {
          flexDirection: !isTablet ? 'row' : 'column',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
        },
        '& .MuiTabs-indicator': {
          display: 'none',
        },
      }}>
      <Tab
        sx={{
          minHeight:"30px",
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '16px',
           color: '#DFDFDF',
          background: 'transparent',
          transition: 'background 0.2s',
          '&.Mui-selected': {
            color: '#fff',
            background: '#034C53',
            borderRadius: '8px',
          },
          border:"1px solid #DFDFDF"
        }}
        label={<TabLabel label="Arena" />}
      />
      <Tab
        sx={{
          minHeight:"30px",
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '16px',
           color: '#DFDFDF',
          background: 'transparent',
          transition: 'background 0.2s',
          '&.Mui-selected': {
            color: '#fff',
            background: '#034C53',
            borderRadius: '8px',
          },
          border:"1px solid #DFDFDF"
        }}
        label={<TabLabel label="Security & Password" />}
      />
      <Tab
        sx={{
          minHeight:"30px",
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '16px',
           color: '#DFDFDF',
          background: 'transparent',
          transition: 'background 0.2s',
          '&.Mui-selected': {
            color: '#fff',
            background: '#034C53',
            borderRadius: '8px',
          },
          border:"1px solid #DFDFDF"
        }}
        label={<TabLabel label="Cancellation Policy" />}
      />
      <Tab
        sx={{
          minHeight:"30px",
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '16px',
           color: '#DFDFDF',
          background: 'transparent',
          transition: 'background 0.2s',
          '&.Mui-selected': {
            color: '#fff',
            background: '#034C53',
            borderRadius: '8px',
          },
          border:"1px solid #DFDFDF"

        }}
        label={<TabLabel  label="Access control settings" />}
      />
      <Tab
        sx={{
          minHeight:"30px",
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '16px',
           color: '#DFDFDF',
          background: 'transparent',
          transition: 'background 0.2s',
          '&.Mui-selected': {
            color: '#fff',
            background: '#034C53',
            borderRadius: '8px',
          },
          border:"1px solid #DFDFDF"

        }}
        label={<TabLabel label="Lighting management settings" />}
      />
    </Tabs>
  )
}
