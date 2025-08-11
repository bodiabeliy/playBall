import { Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'
import ProfileIcon from '../../../../shared/assets/icons/settings/profile.svg?react'
import WorkersIcon from '../../../../shared/assets/icons/settings/workers.svg?react'
import ScheduleIcon from '../../../../shared/assets/icons/settings/schedule.svg?react'
import CashIcon from '../../../../shared/assets/icons/settings/cash.svg?react'
import IntegrationsIcon from '../../../../shared/assets/icons/settings/integrations.svg?react'
import SettingsIcon from '../../../../shared/assets/icons/settings/settings.svg?react'
import DictionaryIcon from '../../../../shared/assets/icons/settings/dictionary.svg?react'
import PriceIcon from '../../../../shared/assets/icons/settings/price.svg?react'
import { TabLabel } from '../../../../shared/components/ui/tab-label'

interface SettingsNavigationProps {
  activeTab: number
  onTabChange: (newValue: number) => void
}

export function SettingsNavigation({ activeTab, onTabChange }: SettingsNavigationProps) {
  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <Tabs
      value={activeTab}
      onChange={(_, newValue) => {
        onTabChange(newValue)
      }}
      variant="scrollable"
      orientation={isTablet ? 'horizontal' : 'vertical'}
      sx={{
        '& .MuiTabs-flexContainer': {
          flexDirection: isTablet ? 'row' : 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        },
        '& .MuiTabs-indicator': {
          backgroundColor: '#0029d9',
        },
      }}>
      <Tab
        sx={{
          '&.Mui-selected': {
            color: '#0029d9',
          },
        }}
        label={<TabLabel icon={<ProfileIcon />} label="Профіль клініки" />}
      />
      <Tab
        sx={{
          '&.Mui-selected': {
            color: '#0029d9',
          },
        }}
        label={<TabLabel icon={<WorkersIcon />} label="Працівники" />}
      />
      <Tab
        sx={{
          '&.Mui-selected': {
            color: '#0029d9',
          },
        }}
        label={<TabLabel icon={<ScheduleIcon />} label="Розклад" />}
      />
      <Tab
        sx={{
          '&.Mui-selected': {
            color: '#0029d9',
          },
        }}
        label={<TabLabel icon={<PriceIcon />} label="Прайс" />}
      />
      <Tab
        sx={{
          '&.Mui-selected': {
            color: '#0029d9',
          },
        }}
        label={<TabLabel icon={<CashIcon />} label="Налаштування ЗП, бонуси" />}
      />
      <Tab
        sx={{
          '&.Mui-selected': {
            color: '#0029d9',
          },
        }}
        label={<TabLabel icon={<IntegrationsIcon />} label="Інтеграції" />}
      />
      <Tab
        sx={{
          '&.Mui-selected': {
            color: '#0029d9',
          },
        }}
        label={<TabLabel icon={<SettingsIcon />} label="Загальні налаштування" />}
      />
      <Tab
        sx={{
          '&.Mui-selected': {
            color: '#0029d9',
          },
        }}
        label={<TabLabel icon={<DictionaryIcon />} label="Довідники" />}
      />
    </Tabs>
  )
}
