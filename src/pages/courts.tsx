import { useState } from 'react'

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { SidebarLayout } from '../shared'


import { CourtsContent } from '../widgets/courts/courts-content'
import { CourtsNavigation } from '../widgets/courts/courts-navigation'

export default function CourtsPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallDesktop = useMediaQuery(theme.breakpoints.down(2000))


  const [activeTab, setActiveTab] = useState(0)
  console.log("activeTab", activeTab);
  



  return (
    <SidebarLayout title="courts table">
      <Box
        sx={{
          mx: 'auto',
          mt: isMobile ? 2 : 4,
          bgcolor: 'white',
          borderRadius: 3,
          p: isMobile ? 2 : 4,
          width: '100%',
        }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Courts
        </Typography>
        
         <Box
            sx={{ display: 'grid', gridTemplateColumns: isSmallDesktop ? '1fr' : '2fr 10fr', gap: '24px', mt: '16px' }}>
            <CourtsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            <CourtsContent activeTab={activeTab} />
          </Box>
      </Box>
    </SidebarLayout>
  )
}
 