import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  Typography,
  FormControl,
  Stack,
  Divider,
  Switch,
} from '@mui/material'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { enUS } from 'date-fns/locale'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import type { DateRange } from '@mui/x-date-pickers-pro'
import dayjs, { Dayjs } from 'dayjs'

import type { IPriceSegment, IPricing } from '../../../../app/providers/types/pricing'
import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers'
import { clubSelector } from '../../../../app/providers/reducers/ClubSlice'
import { courtsSelector } from '../../../../app/providers/reducers/CourtSlice'
import { getAllCourts } from '../../../../app/services/CourtService'
import { COLORS, DAYS } from '../../../settings-pricing/model/constants'
import { useNavigate } from 'react-router'
import { SimpleUniversalSeasonPicker } from '../../../../shared/components/date-pickers'
import TrashIcon from "../../../../shared/assets/icons/trash.svg?react"

interface EditPricingFormProps {
  onCancel?: () => void
  onSave: (data: IPricing) => void
  pricing?: IPricing
}

export function EditPricingForm({ pricing, onCancel, onSave }: EditPricingFormProps) {
  const [formData, setFormData] = useState<IPricing>({
    name: '',
    description: '',
    is_timed: false,
    start_date: '',
    end_date: '',
    price_segments: [
      {
        name: 'Morning',
        start_time: '08:00',
        end_time: '14:00',
        price: 0,
        color: COLORS[0],
        days_of_week: [1, 2, 5],
      },
    ],
    court_ids: [],
    courts: [],
  })
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null])
  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const currentClub = useAppSelector(clubSelector)
  const courtsList = useAppSelector(courtsSelector)

  // Time helper functions
  const makeTime = useCallback((h: number, m: number, s = 0): Date => {
    const d = new Date()
    d.setHours(h, m, s, 0)
    return d
  }, [])

  const parseTimeToDate = useCallback(
    (value: string): Date => {
      if (typeof value === 'string' && value.includes(':')) {
        const parts = value.split(':').map((n) => parseInt(n, 10))
        const [h = 0, m = 0] = parts
        return makeTime(h, m, 0)
      }
      return makeTime(9, 0)
    },
    [makeTime]
  )

  // Fetch courts for current club when dialog opens
  useEffect(() => {
    if (currentClub?.id) {
      dispatch(getAllCourts(currentClub.id))
    }
  }, [currentClub?.id, dispatch])

  useEffect(() => {
    if (pricing) {
      setFormData({
        ...pricing,
      })

      // Initialize date range if dates exist in pricing
      if (pricing.start_date && pricing.end_date) {
        setDateRange([dayjs(pricing.start_date), dayjs(pricing.end_date)])
      }
    } else {
      setFormData({
        name: '',
        description: '',
        is_timed: false,
        start_date: '',
        end_date: '',
        price_segments: [
          {
            name: 'Morning',
            start_time: '08:00',
            end_time: '14:00',
            price: 0,
            color: COLORS[0],
            days_of_week: [1, 2, 5],
          },
        ],
        court_ids: [],
        courts: [],
      })
      setDateRange([null, null])
    }
  }, [pricing])

  const handleChange = <K extends keyof IPricing>(key: K, value: IPricing[K]) => {
    if (key === 'is_timed' && value === false) {
      // Reset price segments to default when timed pricing is turned off
      setFormData((prev) => ({
        ...prev,
        [key]: value,
        price_segments: [
          {
            name: 'Morning',
            start_time: '08:00',
            end_time: '14:00',
            price: 0,
            color: COLORS[0],
            days_of_week: [1, 2, 5],
          },
        ],
      }))
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }))
    }
  }

  const isDateRangeValid = useMemo(() => {
    if (!formData.start_date || !formData.end_date) return false
    return new Date(formData.start_date) <= new Date(formData.end_date)
  }, [formData.start_date, formData.end_date])

  const segmentsValid = useMemo(() => {
    return (formData.price_segments || []).every(
      (s) => Boolean(s.name && s.start_time && s.end_time) && Number(s.price) >= 0 && (s.days_of_week?.length || 0) > 0
    )
  }, [formData.price_segments])

  const addSegment = () => {
    // Only allow adding segments if timed pricing is enabled
    if (!formData.is_timed) {
      return
    }

    const seg: IPriceSegment = {
      name: 'Morning',
      start_time: '08:00',
      end_time: '14:00',
      price: 0,
      color: COLORS[0],
      days_of_week: [1, 2, 5],
    }
    handleChange('price_segments', [...(formData.price_segments || []), seg])
  }

  const updateSegment = (index: number, patch: Partial<IPriceSegment>) => {
    const next = [...(formData.price_segments || [])]
    next[index] = { ...next[index], ...patch }
    handleChange('price_segments', next)
  }

  const removeSegment = (index: number) => {
    const next = [...(formData.price_segments || [])]

    // If this is the only segment and timed pricing is disabled, don't remove it
    if (!formData.is_timed && next.length <= 1) {
      return
    }

    // Don't allow removing the last segment if timed pricing is enabled
    if (formData.is_timed && next.length <= 1) {
      return
    }

    next.splice(index, 1)
    handleChange('price_segments', next)
  }

  const handleSave = () => {
    onSave(formData)
    navigate(-1)
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          <span onClick={() => navigate(-1)} style={{ marginRight: '8px', color: '#034C53', cursor: 'pointer' }}>
            Pricing /
          </span>
          {pricing ? 'Edit price' : 'New Price'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={() => navigate(-1)}
            variant="contained"
            sx={{
              borderRadius: '12px',
              backgroundColor: '#DFDFDF',
              color: 'black',
              transition: 'none',
              boxShadow: 'none',
              fontWeight: 'normal',
              '&:hover': {
                boxShadow: 'none',
              },
              '&:active': {
                boxShadow: 'none',
              },
            }}>
            Cancel
          </Button>
          {pricing && (
            <Button
              variant="contained"
              onClick={onCancel}
              sx={{
                borderRadius: '12px',
                backgroundColor: '#E7515A',
                color: 'white',
                transition: 'none',
                boxShadow: 'none',
                fontWeight: 'normal',
                '&:hover': {
                  boxShadow: 'none',
                },
                '&:active': {
                  boxShadow: 'none',
                },
              }}>
              Delete
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              !(
                isDateRangeValid &&
                (formData.court_ids?.length || 0) > 0 &&
                (formData.price_segments?.length || 0) > 0 &&
                segmentsValid
              )
            }
            sx={{
              borderRadius: '12px',
              padding: '8px 16px',
              backgroundColor: '#034C53',
              color: '#FFFFFF',
              textTransform: 'none',
              fontWeight: 'normal',
              '&:hover': {
                backgroundColor: '#023940',
              },
              '&.Mui-disabled': {
                backgroundColor: '#E5E5E5',
                color: '#A0A0A0',
              },
            }}>
            {pricing ? 'Update' : 'Save'}
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          background: '#fff',
        }}>
        <Box
          sx={{
            minWidth: { md: 300 },
            width: { md: 320 },
            flexShrink: 0,
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
            p: 3,
          }}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 4 }}>
            Rules & Pricing
          </Typography>
          <Typography variant="body2" color="rgba(21, 22, 24, 0.6)" sx={{ mb: 1 }}>
            Courts ruled by this price
          </Typography>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Select
              multiple
              value={(formData.court_ids || []) as string[]}
              onChange={() => {}}
              displayEmpty
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
              sx={{
                height: '42px',
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E5E5E5',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#034C53',
                  borderWidth: '1px',
                },
              }}
              renderValue={(selected) => {
                // Get the array of selected court IDs
                const selectedIds = selected as string[]

                // Check if all courts are selected
                const total = courtsList?.items?.length || 0
                const allSelected = total > 0 && selectedIds.length === total

                if (allSelected) {
                  return <Typography fontWeight={500}>All Courts</Typography>
                }

                // Filter out any undefined values and format court names nicely
                const courtNames = selectedIds
                  .map((id) => courtsList?.items?.find((c) => String(c.id) === String(id))?.name)
                  .filter(Boolean)

                if (courtNames.length === 0) {
                  return <Typography sx={{ color: 'text.secondary' }}>Select courts</Typography>
                }

                return <Typography fontWeight={500}>{courtNames.join(', ')}</Typography>
              }}>
              {/* All Courts selection item */}
              <MenuItem
                sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: '6px 16px' }}
                disableRipple
                onClick={(e) => {
                  // Prevent the default Select behavior
                  e.preventDefault()
                  e.stopPropagation()

                  // Calculate whether all courts are currently selected
                  const total = courtsList?.items?.length || 0
                  const allSelected =
                    total > 0 &&
                    formData.court_ids?.length === total &&
                    courtsList.items.every((c) => formData.court_ids.includes(String(c.id)))

                  if (allSelected) {
                    // Deselect all
                    handleChange('court_ids', [])
                  } else {
                    // Select all - make sure we have court items first
                    if (courtsList?.items?.length) {
                      handleChange(
                        'court_ids',
                        courtsList.items.map((c) => String(c.id))
                      )
                    }
                  }
                }}>
                {(() => {
                  const total = courtsList?.items?.length || 0
                  const selectedIds = formData.court_ids || []
                  const selectedCount = selectedIds.length
                  const allSelected =
                    total > 0 &&
                    selectedCount === total &&
                    courtsList.items.every((c) => selectedIds.includes(String(c.id)))
                  const someSelected = selectedCount > 0 && !allSelected

                  return (
                    <Box
                      sx={{
                        position: 'relative',
                        width: 18,
                        height: 18,
                        border: '2px solid',
                        borderColor: allSelected || someSelected ? '#034C53' : '#ccc',
                        borderRadius: '4px',
                        backgroundColor: allSelected ? '#034C53' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}>
                      {allSelected && (
                        <Box
                          component="span"
                          sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold', lineHeight: 1 }}>
                          ✓
                        </Box>
                      )}
                      {!allSelected && someSelected && (
                        <Box component="span" sx={{ width: 10, height: 2, bgcolor: '#034C53', borderRadius: 1 }} />
                      )}
                    </Box>
                  )
                })()}
                <Typography>All Courts</Typography>
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              {/* Individual court items */}
              {courtsList?.items?.map((court) => {
                const courtId = String(court.id)
                const isSelected = formData.court_ids?.includes(courtId) || false

                return (
                  <MenuItem
                    key={court.id}
                    value={courtId}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: '6px 16px' }}
                    onClick={(e) => {
                      // Custom click handler that toggles this specific court
                      e.preventDefault()
                      e.stopPropagation()

                      const currentIds = [...(formData.court_ids || [])]

                      if (isSelected) {
                        // Remove this court
                        handleChange(
                          'court_ids',
                          currentIds.filter((id) => id !== courtId)
                        )
                      } else {
                        // Add this court
                        handleChange('court_ids', [...currentIds, courtId])
                      }
                    }}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: 18,
                        height: 18,
                        border: isSelected ? '2px solid #034C53' : '2px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: isSelected ? '#034C53' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}>
                      {isSelected && (
                        <Box
                          component="span"
                          sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold', lineHeight: 1 }}>
                          ✓
                        </Box>
                      )}
                    </Box>
                    <Typography ml={1}>{court.name}</Typography>
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <Typography variant="body2" color="rgba(21, 22, 24, 0.6)" sx={{ mb: 1 }}>
            Season
          </Typography>
          <SimpleUniversalSeasonPicker
            initialValue={dateRange}
            format="MMM D, yyyy"
            placeholder="Select season"
            onRangeChange={(newRange) => {
              if (newRange[0]) {
                handleChange('start_date', newRange[0].format('YYYY-MM-DD'))
              }
              if (newRange[1]) {
                handleChange('end_date', newRange[1].format('YYYY-MM-DD'))
              }
              setDateRange(newRange)
            }}
            errorMessage={!isDateRangeValid ? 'End date must be after start date' : ''}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
            p: 3,
          }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Date & Time
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" color="rgba(21, 22, 24, 0.6);">
                Timed price
              </Typography>
              <Switch
                checked={formData.is_timed}
                onChange={(e) => handleChange('is_timed', e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#034C53',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#034C53',
                  },
                }}
              />
            </Stack>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {(formData.price_segments || []).map((seg, idx) => (
              <Box
                key={idx}
                sx={{
                  position: 'relative',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  px: 3,
                  pt: 3,
                  pb: 2,
                  backgroundColor: '#FFFFFF',
                }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Header with field labels */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 2,
                      mb: 1,
                    }}>
                    <Typography variant="body2" color="rgba(21, 22, 24, 0.6)">
                      Pricing Name
                    </Typography>
                    <Typography variant="body2" color="rgba(21, 22, 24, 0.6)">
                      Start Time
                    </Typography>
                    <Typography variant="body2" color="rgba(21, 22, 24, 0.6)">
                      End Time
                    </Typography>
                    <Typography variant="body2" color="rgba(21, 22, 24, 0.6)">
                      Price
                    </Typography>
                  </Box>

                  {/* Input fields in a row */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 2,
                      mb: 3,
                    }}>
                    <TextField
                      fullWidth
                      placeholder="Morning"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      InputProps={{
                        sx: {
                          height: '42px',
                          padding: '8px 14px',
                          outline: 'none',
                          borderRadius: '12px',
                          border: '1px solid #E5E5E5',
                          fontSize: '14px',
                          backgroundColor: '#fff',
                          color: formData.name ? '#151618' : '#64748B',
                          fontWeight: formData.name ? 500 : 400,
                          fontFamily: 'inherit',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: '#CBD5E1',
                          },
                          '&.Mui-focused': {
                            borderColor: '#034C53',
                            boxShadow: '0 0 0 3px rgba(3, 76, 83, 0.1)',
                          },
                          '& input::placeholder': {
                            color: '#64748B',
                            opacity: 1,
                            fontWeight: 500,
                          },
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                      }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
                      <TimePicker
                        value={parseTimeToDate(seg.start_time)}
                        onChange={(newValue) => {
                          if (newValue) {
                            const hours = newValue.getHours().toString().padStart(2, '0')
                            const minutes = newValue.getMinutes().toString().padStart(2, '0')
                            updateSegment(idx, { start_time: `${hours}:${minutes}` })
                          }
                        }}
                        format="HH:mm"
                        ampm={false}
                        slots={{
                          openPickerIcon: AccessTimeIcon,
                        }}
                        slotProps={{
                          inputAdornment: {
                            sx: { scale: 0.75 },
                            position: 'start',
                          },
                          textField: {
                            size: 'small',
                            fullWidth: true,
                            sx: {
                              '& .MuiInputBase-root': {
                                height: '42px',
                                borderRadius: '12px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #E5E5E5',
                                fontSize: '14px',
                                color: '#151618',
                                fontWeight: 500,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  borderColor: '#CBD5E1',
                                },
                                '&.Mui-focused': {
                                  borderColor: '#034C53',
                                  boxShadow: '0 0 0 3px rgba(3, 76, 83, 0.1)',
                                },
                                '& .MuiInputBase-input': {
                                  padding: '8px 14px',
                                  fontFamily: 'inherit',
                                  '&::placeholder': {
                                    color: '#64748B',
                                    opacity: 1,
                                    fontWeight: 500,
                                  },
                                },
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                              '& .MuiInputAdornment-root': {
                                color: '#64748B',
                                marginRight: '8px',
                              },
                            },
                          },
                          layout: {
                            sx: {
                              '& .MuiPickersLayout-contentWrapper': {
                                '& .Mui-selected': {
                                  backgroundColor: '#034C53 !important',
                                },
                                '& .MuiClock-pin': {
                                  backgroundColor: '#034C53 !important',
                                },
                                '& .MuiClockPointer-root': {
                                  backgroundColor: '#034C53 !important',
                                  '& .MuiClockPointer-thumb': {
                                    backgroundColor: '#034C53 !important',
                                    borderColor: '#034C53 !important',
                                  },
                                },
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
                      <TimePicker
                        value={parseTimeToDate(seg.end_time)}
                        onChange={(newValue) => {
                          if (newValue) {
                            const hours = newValue.getHours().toString().padStart(2, '0')
                            const minutes = newValue.getMinutes().toString().padStart(2, '0')
                            updateSegment(idx, { end_time: `${hours}:${minutes}` })
                          }
                        }}
                        format="HH:mm"
                        ampm={false}
                        slots={{
                          openPickerIcon: AccessTimeIcon,
                        }}
                        slotProps={{
                          inputAdornment: {
                            sx: { scale: 0.75 },
                            position: 'start',
                          },
                          textField: {
                            size: 'small',
                            fullWidth: true,
                            sx: {
                              '& .MuiInputBase-root': {
                                height: '42px',
                                borderRadius: '12px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #E5E5E5',
                                fontSize: '14px',
                                color: '#151618',
                                fontWeight: 500,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  borderColor: '#CBD5E1',
                                },
                                '&.Mui-focused': {
                                  borderColor: '#034C53',
                                  boxShadow: '0 0 0 3px rgba(3, 76, 83, 0.1)',
                                },
                                '& .MuiInputBase-input': {
                                  padding: '8px 14px',
                                  fontFamily: 'inherit',
                                  '&::placeholder': {
                                    color: '#64748B',
                                    opacity: 1,
                                    fontWeight: 500,
                                  },
                                },
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                              '& .MuiInputAdornment-root': {
                                color: '#64748B',
                                marginRight: '8px',
                              },
                            },
                          },
                          layout: {
                            sx: {
                              '& .MuiPickersLayout-contentWrapper': {
                                '& .Mui-selected': {
                                  backgroundColor: '#034C53 !important',
                                },
                                '& .MuiClock-pin': {
                                  backgroundColor: '#034C53 !important',
                                },
                                '& .MuiClockPointer-root': {
                                  backgroundColor: '#034C53 !important',
                                  '& .MuiClockPointer-thumb': {
                                    backgroundColor: '#034C53 !important',
                                    borderColor: '#034C53 !important',
                                  },
                                },
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                    <TextField
                      fullWidth
                      type="number"
                      inputProps={{ min: 0, step: 0.5 }}
                      value={seg.price}
                      onChange={(e) => updateSegment(idx, { price: Number(e.target.value) })}
                      InputProps={{
                        startAdornment: (
                          <span style={{ marginRight: 5, color: seg.price ? '#151618' : '#64748B' }}>€</span>
                        ),
                        sx: {
                          height: '42px',
                          padding: '8px 14px',
                          paddingLeft: '8px', // Less left padding to accommodate the euro symbol
                          outline: 'none',
                          borderRadius: '12px',
                          border: '1px solid #E5E5E5',
                          fontSize: '14px',
                          backgroundColor: '#fff',
                          color: seg.price ? '#151618' : '#64748B',
                          fontWeight: seg.price ? 500 : 400,
                          fontFamily: 'inherit',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            border: '1px solid #CBD5E1',
                          },
                          '&.Mui-focused': {
                            border: '1px solid #034C53',
                            boxShadow: '0 0 0 3px rgba(3, 76, 83, 0.1)',
                          },
                          '& input': {
                            padding: '0 0 0 5px',
                            fontFamily: 'inherit',
                          },
                          '& input::placeholder': {
                            color: '#64748B',
                            opacity: 1,
                            fontWeight: 500,
                          },
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                      }}
                    />
                  </Box>

                  {/* Second row with days of week and color */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr',
                      gap: 2,
                      alignItems: 'flex-start',
                    }}>
                    <Box>
                      <Typography variant="body2" color="rgba(21, 22, 24, 0.6)" sx={{ mb: 1 }}>
                        Day of the week
                      </Typography>

                      <FormControl fullWidth>
                        <Select
                          multiple
                          value={(seg.days_of_week || []) as number[]}
                          onChange={(e) => {
                            updateSegment(idx, { days_of_week: e.target.value as number[] })
                          }}
                          displayEmpty
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 300,
                              },
                            },
                          }}
                          sx={{
                            height: '42px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#151618',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#E5E5E5',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#CBD5E1',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#034C53',
                              boxShadow: '0 0 0 3px rgba(3, 76, 83, 0.1)',
                              borderWidth: '1px',
                            },
                            '& .MuiSelect-select': {
                              padding: '8px 14px',
                              fontFamily: 'inherit',
                            },
                          }}
                          renderValue={(selected) => {
                            const selectedValues = selected as number[]
                            if (selectedValues.length === 0) {
                              return <Typography sx={{ color: '#64748B', fontWeight: 500 }}>Select days</Typography>
                            }

                            return (
                              <Typography fontWeight={500} color="#151618">
                                {selectedValues
                                  .map((value) => DAYS.find((d) => d.value === value)?.label)
                                  .filter(Boolean)
                                  .join(', ')}
                              </Typography>
                            )
                          }}>
                          {/* Individual day items */}
                          {DAYS.map((day) => {
                            const isSelected = (seg.days_of_week || []).includes(day.value)

                            return (
                              <MenuItem
                                key={day.value}
                                value={day.value}
                                sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: '6px 16px' }}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()

                                  const currentDays = [...(seg.days_of_week || [])]

                                  if (isSelected) {
                                    // Remove this day
                                    updateSegment(idx, { days_of_week: currentDays.filter((d) => d !== day.value) })
                                  } else {
                                    // Add this day
                                    updateSegment(idx, { days_of_week: [...currentDays, day.value] })
                                  }
                                }}>
                                <Box
                                  sx={{
                                    position: 'relative',
                                    width: 18,
                                    height: 18,
                                    border: isSelected ? '2px solid #034C53' : '2px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: isSelected ? '#034C53' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                  }}>
                                  {isSelected && (
                                    <Box
                                      component="span"
                                      sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold', lineHeight: 1 }}>
                                      ✓
                                    </Box>
                                  )}
                                </Box>
                                <Typography ml={1}>{day.label}</Typography>
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="rgba(21, 22, 24, 0.6)" sx={{ mb: 1 }}>
                        Pricing Color
                      </Typography>
                      {/* Color picker as horizontal row of selectable color boxes */}
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '8px',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          fontSize: '14px',
                          fontWeight: 400,
                          color: '#1E293B',
                        }}>
                        {COLORS.map((color) => {
                          const isSelected = seg.color === color

                          return (
                            <Box
                              key={color}
                              onClick={() => updateSegment(idx, { color })}
                              sx={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '4px',
                                backgroundColor: color,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: isSelected ? '2px solid #034C53' : '1px solid transparent',
                                boxShadow: isSelected ? '0px 0px 0px 2px rgba(3, 76, 83, 0.2)' : 'none',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)',
                                },
                              }}>
                              {isSelected && (
                                <Box
                                  component="span"
                                  sx={{
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    lineHeight: 1,
                                    textShadow: '0px 0px 2px rgba(0,0,0,0.5)',
                                  }}>
                                  ✓
                                </Box>
                              )}
                            </Box>
                          )
                        })}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Delete button at bottom as shown in reference */}
                <Box sx={{ mt: 2 }}>
                  <Button
                    startIcon={
                      <Box
                        component="span"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TrashIcon />
                      </Box>
                    }
                    onClick={() => removeSegment(idx)}
                    variant="contained"
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: '#DFDFDF',
                      color: 'black',
                      transition: 'none',
                      boxShadow: 'none',
                      fontWeight: 'normal',
                      textTransform:"capitalize",
                      '&:hover': {
                        boxShadow: 'none',
                      },
                      '&:active': {
                        boxShadow: 'none',
                      },
                    }}>
                    Delete Pricing
                  </Button>
                </Box>
              </Box>
            ))}
            {formData.is_timed && (
              <Button
                startIcon={<Box sx={{ fontSize: 18, fontWeight: 'bold' }}>+</Box>}
                variant="contained"
                onClick={addSegment}
                sx={{
                  alignSelf: 'stretch',
                  background: '#034C53',
                  color: '#FFFFFF',
                  border: 'none',
                  '&:hover': {
                    background: '#023940',
                  },
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 'normal',
                  fontSize: '16px',
                }}>
                Add More
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}
