import { Box, useMediaQuery, useTheme } from '@mui/material'
import { SidebarLayout } from '../shared'
import { PricingManagement } from '../features/settings-pricing/components/pricing-management'

export default function PricingPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))



  return (
    <SidebarLayout title="Pricing">
      <Box
        sx={{
          mx: 'auto',
          bgcolor: 'white',
          borderRadius: 3,
          p: isMobile ? 2 : 4,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        
        <Box >
          <PricingManagement />
        </Box>
      </Box>
    </SidebarLayout>
  )
}
