import { Box, Typography, Button, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import ChevronIcon from '../../../../shared/assets/icons/chevron.svg?react'

interface VisitHeaderProps {
  visitNumber: number
  doctorImage: string
  doctorName: string
  onDelete: () => void
}

export function VisitHeader({ visitNumber, doctorImage, onDelete }: VisitHeaderProps) {
  return (
    <Box
      sx={{
        bgcolor: '#f5f7fe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 1,
        p: { xs: 0.5, sm: 1 },
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
        <img
          src={doctorImage}
          alt="doctor"
          width={32}
          height={32}
          style={{
            borderRadius: '8px',
          }}
        />
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: { xs: 12, sm: 14 },
            lineHeight: '150%',
            letterSpacing: '0.01em',
            color: 'rgba(21, 22, 24, 0.87)',
          }}>
          Візит {visitNumber}
        </Typography>
        <Button
          size="small"
          sx={{
            fontWeight: 400,
            fontSize: { xs: 12, sm: 16 },
            lineHeight: '150%',
            letterSpacing: '0.01em',
            color: 'rgba(21, 22, 24, 0.6)',
            textTransform: 'none',
          }}>
          Вкажіть назву візиту
        </Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
        <IconButton sx={{ p: 0 }}>
          <ChevronIcon style={{ transform: 'rotate(90deg)', width: 24, height: 24 }} />
        </IconButton>
        <IconButton onClick={onDelete}>
          <Delete />
        </IconButton>
      </Box>
    </Box>
  )
}
