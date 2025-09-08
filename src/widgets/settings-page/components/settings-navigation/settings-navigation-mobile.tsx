import { Box, Button } from '@mui/material'
import { TabLabel } from '../../../../shared/components/ui/tab-label'

interface SettingsNavigationProps {
  onTabChange: (newValue: number | null) => void
}

export function SettingsNavigationMobile({ onTabChange }: SettingsNavigationProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'flex-start',
        p: '16px',
      }}>
      <Button
        variant="text"
        sx={{
          color: 'rgba(21, 22, 24, 0.87)',
        }}
        onClick={() => onTabChange(0)}>
        <TabLabel label="Areana" />
      </Button>
      <Button
        variant="text"
        sx={{
          color: 'rgba(21, 22, 24, 0.87)',
        }}
        onClick={() => onTabChange(1)}>
        <TabLabel label="Security & Password" />
      </Button>
      <Button
        variant="text"
        sx={{
          color: 'rgba(21, 22, 24, 0.87)',
        }}
        onClick={() => onTabChange(2)}>
        <TabLabel label="Cancellation Policy" />
      </Button>
      <Button
        variant="text"
        sx={{
          color: 'rgba(21, 22, 24, 0.87)',
        }}
        onClick={() => onTabChange(3)}>
        <TabLabel label="Access control settings" />
      </Button>
      <Button
        variant="text"
        sx={{
          color: 'rgba(21, 22, 24, 0.87)',
        }}
        onClick={() => onTabChange(4)}>
        <TabLabel label="Lighting management settings" />
      </Button>

    </Box>
  )
}
