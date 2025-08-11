import { Box, Typography, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import StatusIcon from '../../../../shared/assets/icons/status.svg?react'

interface TreatmentItemProps {
  name: string
  quantity: number
  price: number
  statusColor: string
  onDelete: () => void
}

export function TreatmentItem({ name, quantity, price, statusColor, onDelete }: TreatmentItemProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '24px 1fr 40px 80px 24px', sm: '32px 1fr 48px 100px 32px' },
        alignItems: 'center',
        mb: 1,
        px: { xs: 1, sm: 2 },
        borderBottom: '1px solid #eee',
        minHeight: { xs: 32, sm: 36 },
      }}>
      <Box sx={{ pl: { xs: 0.5, sm: 1 }, display: 'flex', alignItems: 'center' }}>
        <StatusIcon style={{ color: statusColor }} />
      </Box>
      <Typography variant="body2" sx={{ fontSize: { xs: 12, sm: 14 } }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'right', fontSize: { xs: 12, sm: 14 } }}>
        {quantity}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'right', fontSize: { xs: 12, sm: 14 } }}>
        ₴ {price.toFixed(2)}
      </Typography>
      <IconButton size="small" onClick={onDelete}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}
