import { Box, Typography } from '@mui/material'

interface TabLabelProps {
  label: string
  isActive?: boolean
}

export function TabLabel({ label, isActive }: TabLabelProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '30px' }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          fontSize: 14,
          lineHeight: 1.2,
          letterSpacing: '0.03em',
          textTransform: 'capitalize',
          textAlign: 'start',
          color: isActive ? '#0029d9' : 'inherit',
        }}>
        {label}
      </Typography>
    </Box>
  )
}
