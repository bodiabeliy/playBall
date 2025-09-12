import { Box, useMediaQuery, useTheme } from '@mui/material'
import { SidebarLayout } from '../shared'
import { EditPricingForm } from '../features/settings-workers/ui/edit-pricing-form'
import type { IPricing } from '../app/providers/types/pricing'
import { useAppDispatch, useAppSelector } from '../app/providers/store-helpers'
import { clubSelector } from '../app/providers/reducers/ClubSlice'
import { createPricing } from '../app/services/PricingService'

export default function PricingDetailPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useAppDispatch()
  const currentClub = useAppSelector(clubSelector)

    const handleSavePricing = (newPricing: IPricing) => {
      if (currentClub) {
          dispatch(createPricing(currentClub.id, newPricing))
        }
      }
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
          <EditPricingForm onSave={handleSavePricing} />
      </Box>
    </SidebarLayout>
  )
}
