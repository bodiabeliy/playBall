import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  Checkbox,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddIcon from '@mui/icons-material/Add'
import type { IPricing, IPriceSegment } from '../../../../app/providers/types/pricing'
import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers'
import { clubSelector } from '../../../../app/providers/reducers/ClubSlice'
import { courtsSelector } from '../../../../app/providers/reducers/CourtSlice'
import { getAllCourts } from '../../../../app/services/CourtService'

export interface CreatePricingDialogProps {
  open: boolean
  onClose: () => void
  onSave: (pricing: IPricing) => void
  pricing?: IPricing | null
  title?: string
}

const COLORS = ['#84E81D', '#00B894', '#1ABCFE', '#9B51E0', '#F2994A', '#EB5757']
const DAYS = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
]

export function CreatePricingDialog({ open, onClose, onSave, pricing = null, title }: CreatePricingDialogProps) {
  const dispatch = useAppDispatch()
  const currentClub = useAppSelector(clubSelector)
  const courtsList = useAppSelector(courtsSelector)

  const [formData, setFormData] = useState<IPricing>({
    name: '',
    description: '',
    is_timed: false,
    start_date: '',
    end_date: '',
    price_segments: [],
    court_ids: [],
    courts: [],
  })

  // Fetch courts for current club when dialog opens
  useEffect(() => {
    if (open && currentClub?.id) {
      dispatch(getAllCourts(currentClub.id))
    }
  }, [open, currentClub?.id, dispatch])

  // Prefill when editing; reset when closed
  useEffect(() => {
    if (open) {
      if (pricing) {
        setFormData({
          name: pricing.name || '',
          description: pricing.description || '',
          is_timed: Boolean(pricing.is_timed),
          start_date: pricing.start_date || '',
          end_date: pricing.end_date || '',
          price_segments: pricing.price_segments || [],
          court_ids: pricing.court_ids || [],
          courts: pricing.courts || [],
        })
      }
    } else {
      setFormData({
        name: '',
        description: '',
        is_timed: false,
        start_date: '',
        end_date: '',
        price_segments: [],
        court_ids: [],
        courts: [],
      })
    }
  }, [open, pricing])

  const handleField = <K extends keyof IPricing>(key: K, value: IPricing[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  // Segments helpers
  const addSegment = () => {
    const seg: IPriceSegment = {
      name: 'Morning',
      start_time: '08:00',
      end_time: '14:00',
      price: 0,
      color: COLORS[0],
      days_of_week: [1, 2, 5],
    }
    handleField('price_segments', [...(formData.price_segments || []), seg])
  }

  const updateSegment = (index: number, patch: Partial<IPriceSegment>) => {
    const next = [...(formData.price_segments || [])]
    next[index] = { ...next[index], ...patch }
    handleField('price_segments', next)
  }

  const removeSegment = (index: number) => {
    const next = [...(formData.price_segments || [])]
    next.splice(index, 1)
    handleField('price_segments', next)
  }

  // Derived validation state
  const isDateRangeValid = useMemo(() => {
    if (!formData.start_date || !formData.end_date) return false
    return new Date(formData.start_date) <= new Date(formData.end_date)
  }, [formData.start_date, formData.end_date])

  const segmentsValid = useMemo(() => {
    return (formData.price_segments || []).every((s) =>
      Boolean(s.name && s.start_time && s.end_time) &&
      Number(s.price) >= 0 &&
      (s.days_of_week?.length || 0) > 0
    )
  }, [formData.price_segments])

//   const canSave = Boolean(
//     formData.name &&
//     isDateRangeValid &&
//     hasCourts &&
//     hasAtLeastOneSegment &&
//     segmentsValid
//   )

  const handleSave = () => {
    onSave({
      ...formData,
      name: formData.name || formData.price_segments?.[0]?.name || 'New Price',
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}>
  <Typography variant="h6" fontWeight={600}>{title || (pricing ? 'Edit Price' : 'New Price')}</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {/* Left: Rules & Pricing */}
          <Box
            sx={{
              minWidth: { md: 300 },
              width: { md: 320 },
              flexShrink: 0,
              background: '#fff',
              borderRadius: 2,
              boxShadow: '0 0 30px rgba(52,52,52,0.06)',
              p: 2,
            }}
          >
            <Typography fontWeight={600} fontSize={14} mb={1}>Rules & Pricing</Typography>

            <Typography fontSize={12} color="text.secondary" sx={{ mb: 0.5 }}>Courts ruled by this price</Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel id="cp-courts">Courts</InputLabel>
              <Select
                labelId="cp-courts"
                label="Courts"
                multiple
                value={(formData.court_ids || []) as string[]}
                onChange={(e) =>
                  handleField(
                    'court_ids',
                    (typeof e.target.value === 'string' ? [e.target.value] : (e.target.value as string[]))
                  )
                }
                input={<OutlinedInput label="Courts" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((id) => {
                      const court = courtsList?.items?.find((c) => String(c.id) === String(id))
                      return <Chip key={id} label={court?.name || id} size="small" />
                    })}
                  </Box>
                )}
              >
                <MenuItem value="__all__">
                  <Checkbox
                    size="small"
                    checked={
                      Boolean(
                        courtsList?.items?.length &&
                          (formData.court_ids || []).length === courtsList.items.length
                      )
                    }
                    indeterminate={
                      Boolean(
                        (formData.court_ids || []).length > 0 &&
                        courtsList?.items &&
                        (formData.court_ids || []).length < courtsList.items.length
                      )
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleField(
                          'court_ids',
                          (courtsList?.items || []).map((c) => String(c.id))
                        )
                      } else {
                        handleField('court_ids', [])
                      }
                    }}
                  />
                  <Typography ml={1}>All Courts</Typography>
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                {courtsList?.items?.map((court) => (
                  <MenuItem key={court.id} value={String(court.id)}>
                    <Checkbox size="small" checked={formData.court_ids?.includes(String(court.id))} />
                    <Typography ml={1}>{court.name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography fontSize={12} color="text.secondary" sx={{ mb: 0.5 }}>Season</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <TextField
                size="small"
                label="Start date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleField('start_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                size="small"
                label="End date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleField('end_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
            {/* Optional: Month checkboxes preview */}
            <FormGroup row sx={{ flexWrap: 'wrap', gap: 1 }}>
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m) => (
                <Chip key={m} label={m} size="small" variant="outlined" />
              ))}
            </FormGroup>
          </Box>

          {/* Right: Date & Time */}
          <Box
            sx={{
              flex: 1,
              background: '#fff',
              borderRadius: 2,
              boxShadow: '0 0 30px rgba(52,52,52,0.06)',
              p: 2,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography fontWeight={600} fontSize={14}>Date & Time</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography fontSize={12} color="text.secondary">Timed price</Typography>
                <Switch
                  size="small"
                  checked={formData.is_timed}
                  onChange={(e) => handleField('is_timed', e.target.checked)}
                />
              </Stack>
            </Stack>

            <Stack spacing={2}>
              {(formData.price_segments || []).map((seg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center">
                    <TextField
                      size="small"
                      label="Pricing Name"
                      value={seg.name}
                      onChange={(e) => updateSegment(idx, { name: e.target.value })}
                      sx={{ minWidth: 160, flex: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Start Time"
                      type="time"
                      value={seg.start_time}
                      onChange={(e) => updateSegment(idx, { start_time: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      sx={{ minWidth: 120 }}
                    />
                    <TextField
                      size="small"
                      label="End Time"
                      type="time"
                      value={seg.end_time}
                      onChange={(e) => updateSegment(idx, { end_time: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      sx={{ minWidth: 120 }}
                    />
                    <TextField
                      size="small"
                      label="Price"
                      type="number"
                      inputProps={{ min: 0, step: 0.5 }}
                      value={seg.price}
                      onChange={(e) => updateSegment(idx, { price: Number(e.target.value) })}
                      sx={{ minWidth: 120 }}
                    />
                  </Stack>

                  {/* Days of week */}
                  <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
                    <FormControl size="small" sx={{ minWidth: 260 }}>
                      <InputLabel id={`days-${idx}`}>Day of the week</InputLabel>
                      <Select
                        labelId={`days-${idx}`}
                        multiple
                        value={seg.days_of_week as number[]}
                        label="Day of the week"
                        onChange={(e) => {
                          const val = e.target.value as number[]
                          updateSegment(idx, { days_of_week: val })
                        }}
                        input={<OutlinedInput label="Day of the week" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as number[]).map((v) => (
                              <Chip key={v} label={DAYS.find((d) => d.value === v)?.label || v} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {DAYS.map((d) => (
                          <MenuItem key={d.value} value={d.value}>
                            <Checkbox size="small" checked={seg.days_of_week.includes(d.value)} />
                            <Typography ml={1}>{d.label}</Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Color chooser */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 1 }}>
                      {COLORS.map((c) => (
                        <Box
                          key={c}
                          onClick={() => updateSegment(idx, { color: c })}
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: 1,
                            bgcolor: c,
                            cursor: 'pointer',
                            border: seg.color === c ? '2px solid #0f766e' : '2px solid transparent',
                          }}
                        />
                      ))}
                    </Stack>

                    <Box flex={1} />
                    <Button
                      color="inherit"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => removeSegment(idx)}
                      sx={{ color: '#6b7280' }}
                    >
                      Delete Pricing
                    </Button>
                  </Stack>
                </Box>
              ))}

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addSegment}
                sx={{ alignSelf: 'stretch', background: '#034C53', '&:hover': { background: '#023940' } }}
              >
                Add More
              </Button>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ borderColor: '#0029d9', color: '#0029d9' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!(isDateRangeValid && (formData.court_ids?.length || 0) > 0 && (formData.price_segments?.length || 0) > 0 && segmentsValid)}
          sx={{ background: '#0029d9' }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreatePricingDialog
