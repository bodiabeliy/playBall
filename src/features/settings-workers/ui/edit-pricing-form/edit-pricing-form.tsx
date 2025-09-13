import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  Typography,
  FormControl,
  Stack,
  Checkbox,
  Divider,
  Switch,
} from '@mui/material'
import type { DateRange } from '@mui/x-date-pickers-pro'
import dayjs, { Dayjs } from 'dayjs'
import DeleteIcon from '@mui/icons-material/Delete'

import type { IPriceSegment, IPricing } from '../../../../app/providers/types/pricing'
import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers'
import { clubSelector } from '../../../../app/providers/reducers/ClubSlice'
import { courtsSelector } from '../../../../app/providers/reducers/CourtSlice'
import { getAllCourts } from '../../../../app/services/CourtService'
import { COLORS, DAYS } from '../../../settings-pricing/model/constants'
import { useNavigate } from 'react-router'
import { SimpleUniversalDateTimeRangePicker } from '../../../../shared/components/universal-date-time-range-picker'

interface EditPricingFormProps {
  onCancel?: () => void
  onSave: (data: IPricing) => void
  pricing?: IPricing
}

export function EditPricingForm({  pricing, onCancel,onSave }: EditPricingFormProps) {

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
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null])
  const navigate = useNavigate()
  
  const dispatch = useAppDispatch()
  const currentClub = useAppSelector(clubSelector)
  const courtsList = useAppSelector(courtsSelector)

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
        price_segments: [],
        court_ids: [],
        courts: [],
      })
      setDateRange([null, null])
    }
  }, [pricing])

  const handleChange = <K extends keyof IPricing>(key: K, value: IPricing[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

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

  const addSegment = () => {
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
    next.splice(index, 1)
    handleChange('price_segments', next)
  }

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="body1" sx={{fontWeight: 500}}>
          <span onClick={() => navigate(-1)} style={{ marginRight: '8px', color:"#034C53", cursor:"pointer" }}>Pricing /</span> 
          {pricing ? "Edit price" : "New Price"}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              borderRadius: '6px',
              padding: '8px 16px',
              border: '1px solid #E5E5E5',
              color: '#151618',
              textTransform: 'none',
              fontWeight: 'normal',
              '&:hover': {
                border: '1px solid #D5D5D5',
                backgroundColor: '#F9F9F9'
              }
            }}>
            Cancel
          </Button>
          {pricing && (
            <Button
              variant="outlined"
              onClick={() => {/* Delete functionality */}}
              sx={{
                borderRadius: '6px',
                padding: '8px 16px',
                border: '1px solid #FEE2E2',
                color: '#EF4444',
                backgroundColor: '#FFF',
                textTransform: 'none',
                fontWeight: 'normal',
                '&:hover': {
                  backgroundColor: '#FEF2F2',
                  borderColor: '#FECACA'
                }
              }}>
              Delete
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!(isDateRangeValid && (formData.court_ids?.length || 0) > 0 && (formData.price_segments?.length || 0) > 0 && segmentsValid)}
            sx={{
              borderRadius: '6px',
              padding: '8px 16px',
              backgroundColor: '#034C53',
              color: '#FFFFFF',
              textTransform: 'none',
              fontWeight: 'normal',
              '&:hover': {
                backgroundColor: '#023940'
              },
              '&.Mui-disabled': {
                backgroundColor: '#E5E5E5',
                color: '#A0A0A0'
              }
            }}>
            {pricing ? "Update" : "Save"}
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
            borderRadius: '8px',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
            p: 3,
          }}>
         <Typography variant="h6" sx={{ fontWeight: 600, mb: 4, fontSize: 18, color: '#111827' }}>
          Rules & Pricing
        </Typography>

          <Typography variant="body2" color="rgba(21, 22, 24, 0.6)" sx={{ mb: 2 }}>
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
                    maxHeight: 300
                  }
                }
              }}
              sx={{
                height: '42px',
                borderRadius: '8px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E5E5E5'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#034C53',
                  borderWidth: '1px',
                }
              }}
              renderValue={(selected) => {
                // Get the array of selected court IDs
                const selectedIds = selected as string[]
                
                // Check if all courts are selected
                const total = courtsList?.items?.length || 0
                const allSelected = total > 0 && selectedIds.length === total
                
                if (allSelected) {
                  return <Typography>All Courts</Typography>
                }
                
                // Filter out any undefined values and format court names nicely
                const courtNames = selectedIds
                  .map(id => courtsList?.items?.find(c => String(c.id) === String(id))?.name)
                  .filter(Boolean)
                
                if (courtNames.length === 0) {
                  return <Typography sx={{ color: 'text.secondary' }}>Select courts</Typography>
                }
                
                return <Typography>{courtNames.join(', ')}</Typography>
              }}
            >
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
                  const allSelected = total > 0 && formData.court_ids?.length === total &&
                    courtsList.items.every(c => formData.court_ids.includes(String(c.id)))
                  
                  if (allSelected) {
                    // Deselect all
                    handleChange('court_ids', [])
                  } else {
                    // Select all - make sure we have court items first
                    if (courtsList?.items?.length) {
                      handleChange(
                        'court_ids',
                        courtsList.items.map(c => String(c.id))
                      )
                    }
                  }
                }}
              >
                {(() => {
                  const total = courtsList?.items?.length || 0
                  const selectedIds = formData.court_ids || []
                  const selectedCount = selectedIds.length
                  const allSelected = total > 0 && selectedCount === total && 
                    courtsList.items.every(c => selectedIds.includes(String(c.id)))
                  const someSelected = selectedCount > 0 && (!allSelected)
                  
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
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {allSelected && (
                        <Box component="span" sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold', lineHeight: 1 }}>
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
                          currentIds.filter(id => id !== courtId)
                        )
                      } else {
                        // Add this court
                        handleChange(
                          'court_ids',
                          [...currentIds, courtId]
                        )
                      }
                    }}
                  >
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
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isSelected && (
                        <Box component="span" sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold', lineHeight: 1 }}>
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

          <Typography variant="body2" color="rgba(21, 22, 24, 0.6)" sx={{ mb: 2 }}>
            Season
          </Typography>
          
          <SimpleUniversalDateTimeRangePicker
            initialValue={dateRange}
            displayMode="single"
            format="MMM d, yyyy"
            singleLabel=""
            onRangeChange={(newRange) => {
              if (newRange[0]) {
                handleChange('start_date', newRange[0].format('YYYY-MM-DD'));
              }
              if (newRange[1]) {
                handleChange('end_date', newRange[1].format('YYYY-MM-DD'));
              }
              setDateRange(newRange);
            }}
            singleTextFieldProps={{
              fullWidth: true,
              placeholder: "May 4, 2025 - June 22, 2025",
              sx: {
                mb: 0,
                '& .MuiOutlinedInput-root': { 
                  height: '42px',
                  borderRadius: '8px',
                  border: formData.start_date && formData.end_date ? '1px solid #FCA5A5' : '1px solid #E5E5E5',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: formData.start_date && formData.end_date ? '#FCA5A5' : '#E5E5E5',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: formData.start_date && formData.end_date ? '#FCA5A5' : '#CBD5E1',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: formData.start_date && formData.end_date ? '#FCA5A5' : '#034C53',
                    borderWidth: '1px',
                  },
                }
              }
            }}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
            p: 3,
          }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 18, color: '#111827' }}>
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
                  borderRadius: '8px',
                  px: 3,
                  pt: 3,
                  pb: 2,
                  backgroundColor: '#FFFFFF',
                }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Header with field labels */}
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gap: 2, 
                    mb: 2
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
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gap: 2,
                    mb: 3
                  }}>
                    <TextField
                      fullWidth
                      placeholder="Morning"
                      value={seg.name}
                      onChange={(e) => updateSegment(idx, { name: e.target.value })}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          height: '42px',
                          borderRadius: '8px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E5E5E5'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#CBD5E1',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#034C53',
                            borderWidth: '1px',
                          },
                        } 
                      }}
                    />
                    <TextField
                      fullWidth
                      type="time"
                      value={seg.start_time}
                      onChange={(e) => updateSegment(idx, { start_time: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          height: '42px',
                          borderRadius: '8px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E5E5E5'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#CBD5E1',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#034C53',
                            borderWidth: '1px',
                          },
                        } 
                      }}
                    />
                    <TextField
                      fullWidth
                      type="time"
                      value={seg.end_time}
                      onChange={(e) => updateSegment(idx, { end_time: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          height: '42px',
                          borderRadius: '8px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E5E5E5'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#CBD5E1',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#034C53',
                            borderWidth: '1px',
                          },
                        } 
                      }}
                    />
                    <TextField
                      fullWidth
                      type="number"
                      inputProps={{ min: 0, step: 0.5 }}
                      value={seg.price}
                      onChange={(e) => updateSegment(idx, { price: Number(e.target.value) })}
                      placeholder="0"
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          height: '42px',
                          borderRadius: '8px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E5E5E5'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#CBD5E1',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#034C53',
                            borderWidth: '1px',
                          },
                        } 
                      }}
                      InputProps={{
                        startAdornment: <span style={{ marginRight: 5 }}>€</span>,
                      }}
                    />
                  </Box>

                  {/* Second row with days of week and color */}
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: '2fr 1fr', 
                    gap: 2, 
                    alignItems: 'flex-start'
                  }}>
                    <Box>
                      <Typography variant="body2" color="rgba(21, 22, 24, 0.6)" sx={{ mb: 2 }}>
                        Day of the week
                      </Typography>
                      <TextField
                        fullWidth
                        value={seg.days_of_week?.map(v => DAYS.find(d => d.value === v)?.label).join(', ') || "Mon, Tue, Fri"}
                        placeholder="Select days"
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <Box sx={{ color: "#777", marginLeft: 1 }}>▼</Box>
                          ),
                        }}
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            height: '42px',
                            borderRadius: '8px',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#E5E5E5'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#CBD5E1',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#034C53',
                              borderWidth: '1px',
                            },
                          } 
                        }}
                      />
                      
                      <Box sx={{ display: 'none' }}>
                        <FormControl fullWidth>
                          <Select
                            multiple
                            value={seg.days_of_week as number[]}
                            onChange={(e) => {
                              const val = e.target.value as number[]
                              updateSegment(idx, { days_of_week: val })
                            }}
                          >
                            {DAYS.map((d) => (
                              <MenuItem key={d.value} value={d.value}>
                                <Checkbox size="small" checked={seg.days_of_week.includes(d.value)} />
                                <Typography ml={1}>{d.label}</Typography>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="rgba(21, 22, 24, 0.6)" sx={{ mb: 2 }}>
                        Pricing Color
                      </Typography>
                      {/* Color picker */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {COLORS.map((c) => (
                          <Box
                            key={c}
                            onClick={() => updateSegment(idx, { color: c })}
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: 1,
                              bgcolor: c,
                              cursor: 'pointer',
                              border: seg.color === c ? '2px solid #034C53' : 'none',
                              boxShadow: seg.color === c ? '0px 0px 0px 2px rgba(3, 76, 83, 0.2)' : 'none',
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Delete button at bottom as shown in reference */}
                <Box sx={{ mt: 2 }}>
                  <Button
                    startIcon={
                      <Box component="span" sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <DeleteIcon fontSize="small" />
                      </Box>
                    }
                    variant="text"
                    onClick={() => removeSegment(idx)}
                    sx={{
                      borderRadius: '8px',
                      backgroundColor: '#F9FAFB',
                      color: '#64748B',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: 'normal',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#F1F5F9',
                      }
                    }}
                  >
                    Delete Pricing
                  </Button>
                </Box>
              </Box>
            ))}

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
                borderRadius: '8px',
                py: 2,
                textTransform: 'none',
                fontWeight: 'normal',
                fontSize: '16px'
              }}>
              Add More
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}
