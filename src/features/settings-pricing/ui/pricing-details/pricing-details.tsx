import { Dialog, DialogContent, Box, Typography, Button, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { IPricing } from '../../../../app/providers/types/pricing'

interface PricingDetailsDialogProps {
  open: boolean
  onClose: () => void
  pricing: IPricing | null
  onEdit?: (pricing: IPricing) => void
}

function formatSeason(start?: string, end?: string) {
  if (!start || !end) return '-'
  try {
    const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }
    const s = new Date(start).toLocaleDateString('en-US', opts)
    const e = new Date(end).toLocaleDateString('en-US', opts)
    return `${s} – ${e}`
  } catch {
    return `${start} – ${end}`
  }
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatDays(days?: number[]) {
  if (!days || days.length === 0) return '-'
  const sorted = [...new Set(days)].sort((a, b) => a - b)
  return sorted.map((d) => dayNames[d] ?? String(d)).join(', ')
}

function formatTime(value?: string) {
  if (!value) return '-'
  // If already HH:mm style, return as-is
  if (/^\d{1,2}:\d{2}$/.test(value)) return value
  try {
    return new Date(value).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return value
  }
}

export function PricingDetailsDialog({ open, onClose, pricing, onEdit }: PricingDetailsDialogProps) {
  const courts = pricing?.courts?.map((c) => c.name).join(', ') || '-'
  const season = formatSeason(pricing?.start_date, pricing?.end_date)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '8px' } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 3, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
        <Typography variant="h6" sx={{ flex: 1, fontSize: 20 }}>
          Pricing Details
        </Typography>
        <Button
          onClick={onClose}
          sx={{
            minWidth: 'auto',
            p: 0.5,
            color: '#666',
            '&:hover': { background: 'transparent', color: '#000' },
          }}
        >
          <CloseIcon />
        </Button>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3, pt: 3 }}>
        {/* Courts + Season row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Courts ruled by this price
            </Typography>
            <Typography sx={{ mt: 0.5 }}>{courts}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Season
            </Typography>
            <Typography sx={{ mt: 0.5 }}>{season}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {(pricing?.price_segments || []).map((seg, i) => (
          <Box key={i}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Pricing Name
                </Typography>
                <Typography sx={{ mt: 0.5 }}>{seg.name || '-'}</Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                  Day of the week
                </Typography>
                <Typography sx={{ mt: 0.5 }}>{formatDays(seg.days_of_week)}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Start & End Time
                </Typography>
                <Typography sx={{ mt: 0.5 }}>
                  {formatTime(seg.start_time)} - {formatTime(seg.end_time)}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                  Price & Interval
                </Typography>
                <Typography sx={{ mt: 0.5 }}>
                  €{Number(seg.price ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
            {i < (pricing?.price_segments?.length || 0) - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
      </DialogContent>

      {/* Footer */}
      <Box sx={{ display: 'flex', gap: 1.5, px: 3, pb: 3, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          sx={{
            borderRadius: '8px',
            backgroundColor: '#DFDFDF',
            color: 'black',
            border: 'none',
            transition: 'none',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
            '&:active': { boxShadow: 'none' },
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ borderRadius: '8px', backgroundColor: '#034C53', '&:hover': { backgroundColor: '#023a40' } }}
          onClick={() => pricing && onEdit?.(pricing)}
        >
          Edit Price
        </Button>
      </Box>
    </Dialog>
  )
}

export default PricingDetailsDialog
