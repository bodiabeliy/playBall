import { Box, useMediaQuery, useTheme, Typography } from '@mui/material'
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
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        
        {/* Page Title */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            mb: 3,
            color: '#000'
          }}
        >
          Pricing
        </Typography>

        {/* Pricing Management Component */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <PricingManagement />
        </Box>
      </Box>
    </SidebarLayout>
  )
}
