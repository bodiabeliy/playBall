import { useState } from 'react'

import { Box, useMediaQuery, useTheme } from '@mui/material'
import { SidebarLayout } from '../shared'


import { CourtsContent } from '../widgets/courts/courts-content'

export default function CourtsPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallDesktop = useMediaQuery(theme.breakpoints.down(2000))


  const [activeTab] = useState(0)
  
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
         <Box
            sx={{ display: 'grid', gridTemplateColumns: isSmallDesktop ? '1fr' : '2fr 10fr', gap: '24px', mt: '16px' }}>
            <CourtsContent activeTab={activeTab} />
          </Box>
      </Box>
    </SidebarLayout>
  )
}
 