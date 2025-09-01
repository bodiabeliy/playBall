import { Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'

import { TabLabel } from '../../shared/components/ui/tab-label'
import { TAB_LABELS } from '../../features'

interface CourtsNavigationProps {
  activeTab: number
  onTabChange: (newValue: number) => void
}

export function CourtsNavigation({ activeTab, onTabChange }: CourtsNavigationProps) {
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
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        },
        '& .MuiTabs-indicator': {
          display: 'none',
        },
      }}>
      {TAB_LABELS.map((label) => (
        <Tab
          key={label}
          sx={{
            minHeight: '30px',
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
            border: '1px solid #DFDFDF',
          }}
          label={<TabLabel label={label} />}
        />
      ))}
    </Tabs>
  )
}
