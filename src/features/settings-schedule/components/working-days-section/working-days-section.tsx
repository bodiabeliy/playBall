import { Box, Divider, Typography } from '@mui/material'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { enUS } from 'date-fns/locale'
import { useState, useCallback, useEffect } from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import type { IClub, IWorkingHours } from '../../../../app/providers/types/club'

const daysOfWeek = [
  { key: 'mon', label: 'Mon', dayOfWeek: 1, group: 'weekdays' },
  { key: 'tue', label: 'Tue', dayOfWeek: 2, group: 'weekdays' },
  { key: 'wed', label: 'Wed', dayOfWeek: 3, group: 'weekdays' },
  { key: 'thu', label: 'Thu', dayOfWeek: 4, group: 'weekdays' },
  { key: 'fri', label: 'Fri', dayOfWeek: 5, group: 'weekdays' },
  { key: 'sat', label: 'Sat', dayOfWeek: 6, group: 'weekends' },
  { key: 'sun', label: 'Sun', dayOfWeek: 7, group: 'weekends' },
]

export type WorkingDay = {
  key: string
  enabled: boolean
  start: Date | null
  end: Date | null
}

type SectionProps = {
  formData: IClub;
  handleFieldChange: <T extends keyof IClub>(field: T, value: IClub[T]) => void;
  handleFileUpload?: (field: keyof IClub, files: File[] | null) => void;
};

export const WorkingDaysSection = ({ formData, handleFieldChange }: SectionProps) => {
  // Helpers
  const makeTime = useCallback((h: number, m: number, s = 0): Date => {
    const d = new Date();
    d.setHours(h, m, s, 0);
    return d;
  }, []);

  const parseTimeToDate = useCallback((value: unknown, fallback: Date): Date => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    if (typeof value === 'string' && value.includes(':')) {
      const parts = value.split(':').map((n) => parseInt(n, 10));
      const [h = 0, m = 0, s = 0] = parts;
      return makeTime(h, m, s);
    }
    return fallback;
  }, [makeTime]);

  // Convert working_hours from IClub to WorkingDay format if available
  const getInitialWorkingDays = useCallback((): WorkingDay[] => {
    // Default time values for each day (ensuring start < end)
    const getDefaultTimes = (dayKey: string) => {
      switch (dayKey) {
        case 'mon':
          return { start: makeTime(8, 0), end: makeTime(18, 0) };
        case 'tue':
          return { start: makeTime(8, 30), end: makeTime(19, 0) };
        case 'wed':
          return { start: makeTime(9, 0), end: makeTime(17, 30) };
        case 'thu':
          return { start: makeTime(8, 0), end: makeTime(20, 0) };
        case 'fri':
          return { start: makeTime(7, 30), end: makeTime(18, 30) };
        case 'sat':
          return { start: makeTime(10, 0), end: makeTime(16, 0) };
        case 'sun':
          return { start: makeTime(10, 30), end: makeTime(17, 0) };
        default:
          return { start: makeTime(9, 0), end: makeTime(17, 0) };
      }
    };

    if (formData.working_hours && formData.working_hours.length > 0) {
      return daysOfWeek.map(day => {
        const workingHour = formData.working_hours?.find(wh => wh.day_of_week === day.dayOfWeek);
        const defaultTimes = getDefaultTimes(day.key);
        return {
          key: day.key,
          enabled: workingHour ? workingHour.is_active : day.key !== 'sat', // Sunday is enabled by default, only Saturday is disabled
          start: workingHour ? parseTimeToDate(workingHour.start_time as unknown, defaultTimes.start) : defaultTimes.start,
          end: workingHour ? parseTimeToDate(workingHour.end_time as unknown, defaultTimes.end) : defaultTimes.end
        };
      });
    } else {
      return daysOfWeek.map(day => {
        const defaultTimes = getDefaultTimes(day.key);
        return {
          key: day.key,
          enabled: day.key !== 'sat', // Enable all days except Saturday by default
          start: defaultTimes.start,
          end: defaultTimes.end,
        };
      });
    }
  }, [formData.working_hours, parseTimeToDate, makeTime]);

  const [workingDays, setWorkingDaysState] = useState<WorkingDay[]>(getInitialWorkingDays());

  // Reinitialize local state when incoming working_hours changes (e.g., on club switch or after save refresh)
  useEffect(() => {
    const newDays = getInitialWorkingDays();
    setWorkingDaysState(newDays);
    // Only initialize parent form when there are no working hours yet
    if (!formData.working_hours || formData.working_hours.length === 0) {
      const workingHours: IWorkingHours[] = newDays.map((day, index) => ({
        day_of_week: daysOfWeek[index].dayOfWeek,
        is_active: day.enabled,
        start_time: day.start || new Date(),
        end_time: day.end || new Date(),
      }));
      handleFieldChange('working_hours', workingHours);
    }
  }, [getInitialWorkingDays, handleFieldChange, formData.working_hours]);

  // Update IClub's working_hours whenever workingDays changes
  const updateWorkingHours = useCallback((days: WorkingDay[]) => {
    const workingHours: IWorkingHours[] = days.map((day, index) => ({
      day_of_week: daysOfWeek[index].dayOfWeek,
      is_active: day.enabled,
      start_time: day.start || new Date(),
      end_time: day.end || new Date()
    }));
    handleFieldChange('working_hours', workingHours);
  }, [handleFieldChange]);

  const handleToggle = (idx: number) => {
    const updated = workingDays.map((d, i) => (i === idx ? { ...d, enabled: !d.enabled } : d));
    setWorkingDaysState(updated);
    updateWorkingHours(updated);
  };

  const handleTimeChange = (idx: number, field: 'start' | 'end', value: Date | null) => {
    const updated = workingDays.map((d, i) => (i === idx ? { ...d, [field]: value } : d));
    setWorkingDaysState(updated);
    updateWorkingHours(updated);
  };

  // Group days by weekdays and weekends
  const weekdays = workingDays.filter((_, idx) => daysOfWeek[idx].group === 'weekdays');
  const weekends = workingDays.filter((_, idx) => daysOfWeek[idx].group === 'weekends');
  
  const renderDayRow = (day: WorkingDay) => {
    const dayIndex = daysOfWeek.findIndex(d => d.key === day.key);
    const startValue = day.start ?? makeTime(9, 0);
    const endValue = day.end ?? makeTime(17, 0);
    
    return (
      <Box key={day.key} sx={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        mb: 3,
        minHeight: '68px'
      }}>
        {/* Day label and toggle */}
        <Box sx={{ 
          width: '72px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'flex-start',
          mr: 3,
          pt: 0.5
        }}>
          <Typography sx={{ 
            color: '#888888',
            fontSize: '14px',
            fontWeight: 400,
            mb: 1.5,
            lineHeight: 1.2
          }}>
            {daysOfWeek[dayIndex].label}
          </Typography>
          
          {/* Custom Switch (same style as in cancellation-policy-form) */}
          <Box 
            component="span"
            sx={{ 
              display: 'inline-flex',
              width: 42,
              height: 24,
              position: 'relative'
            }}
            aria-label={`Toggle ${daysOfWeek[dayIndex].label}`}
            role="switch"
            aria-checked={day.enabled}
          >
            <Box 
              component="span"
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '34px',
                backgroundColor: day.enabled ? '#034C53' : '#E5E5E5',
                transition: 'background-color 0.3s ease'
              }}
            />
            <Box
              component="span"
              onClick={() => handleToggle(dayIndex)}
              sx={{
                position: 'absolute',
                cursor: 'pointer',
                width: '100%',
                height: '100%',
                opacity: 0,
                zIndex: 1
              }}
            />
            <Box
              component="span"
              sx={{
                position: 'absolute',
                height: '20px',
                width: '20px',
                left: day.enabled ? '18px' : '2px',
                bottom: '2px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: 'left 0.3s ease'
              }}
            />
          </Box>
        </Box>
        
        {/* Time inputs */}
        <Box sx={{ 
          display: 'flex', 
          flex: 1, 
          gap: 3,
          alignItems: 'flex-start'
        }}>
          
          {/* From time */}
          <Box sx={{ flex: 1, ml:3, }}>
            
            <Typography sx={{ 
              fontSize: '13px', 
              color: '#64748B',
              fontWeight: 500,
              mb: 1,
              lineHeight: 1.2
            }}>
              From
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
              <TimePicker
                value={startValue}
                onChange={(newValue) => handleTimeChange(dayIndex, 'start', newValue)}
                disabled={!day.enabled}
                format="HH:mm"
                ampm={false}
                slots={{
                  openPickerIcon: AccessTimeIcon,
                }}
                slotProps={{
                  inputAdornment: {
                    sx:{scale:0.75},
                    position: 'start',
                  },
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      '& .MuiInputBase-root': {
                        borderRadius: '12px',
                        backgroundColor: day.enabled ? '#ffffff' : '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        fontSize: '14px',
                        fontWeight: 400,
                        color: day.enabled ? '#1E293B' : '#94A3B8',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: day.enabled ? '#CBD5E1' : '#E2E8F0',
                        },
                        '&.Mui-focused': {
                          borderColor: day.enabled ? '#0F766E' : '#E2E8F0',
                          boxShadow: day.enabled ? '0 0 0 3px rgba(15, 118, 110, 0.1)' : 'none',
                        },
                        '& .MuiInputBase-input': {
                          padding: '10px 14px',
                          fontFamily: 'inherit',
                          '&::placeholder': {
                            color: '#94A3B8',
                            opacity: 1,
                          },
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '& .MuiInputAdornment-root': {
                        color: day.enabled ? '#64748B' : '#CBD5E1',
                        marginRight: '8px',
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          {/* To time */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ 
              fontSize: '13px', 
              color: '#64748B',
              fontWeight: 500,
              mb: 1,
              lineHeight: 1.2
            }}>
              To
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
              <TimePicker
                value={endValue}
                onChange={(newValue) => handleTimeChange(dayIndex, 'end', newValue)}
                disabled={!day.enabled}
                format="HH:mm"
                ampm={false}
                slots={{
                  openPickerIcon: AccessTimeIcon,
                }}
                slotProps={{
                  inputAdornment: {
                    sx:{scale:0.75},
                    position: 'start',
                  },
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      '& .MuiInputBase-root': {
                        borderRadius: '12px',
                        backgroundColor: day.enabled ? '#ffffff' : '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        fontSize: '14px',
                        fontWeight: 400,
                        color: day.enabled ? '#1E293B' : '#94A3B8',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: day.enabled ? '#CBD5E1' : '#E2E8F0',
                        },
                        '&.Mui-focused': {
                          borderColor: day.enabled ? '#0F766E' : '#E2E8F0',
                          boxShadow: day.enabled ? '0 0 0 3px rgba(15, 118, 110, 0.1)' : 'none',
                        },
                        '& .MuiInputBase-input': {
                          padding: '10px 14px',
                          fontFamily: 'inherit',
                          '&::placeholder': {
                            color: '#94A3B8',
                            opacity: 1,
                          },
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '& .MuiInputAdornment-root': {
                        color: day.enabled ? '#64748B' : '#CBD5E1',
                        marginRight: '8px',
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', p: 0 }}>
      {/* Weekdays Section */}
      <Box sx={{ mb: 5, pt: 2 }}>
        <Typography 
          sx={{ 
            fontSize: '16px', 
            fontWeight: 400, 
            color: '#888888',
            mb: 3,
            letterSpacing: '0.01em'
          }}
        >
          Weekdays
        </Typography>
        <Box sx={{ position: 'relative' }}>
          {/* Vertical divider across all Weekdays rows */}
          <Box
            sx={{
              position: 'absolute',
              left: '96px', // 72px left column + 24px gap (mr:3)
              top: 0,
              bottom: 0,
              width: '1px',
              bgcolor: '#E5E5E5',
              pointerEvents: 'none',
            }}
          />
          {weekdays.map((day) => renderDayRow(day))}
        </Box>
      </Box>
      {/* Horizontal divider between Weekdays and Weekends */}
      <Divider sx={{ borderColor: '#E5E5E5', mb: 3 }} />
      
      {/* Weekends Section */}
      <Box>
        <Typography 
          sx={{ 
            fontSize: '16px', 
            fontWeight: 400, 
            color: '#888888',
            mb: 3,
            letterSpacing: '0.01em'
          }}
        >
          Weekends
        </Typography>
        <Box sx={{ position: 'relative' }}>
          {/* Vertical divider across all Weekends rows */}
          <Box
            sx={{
              position: 'absolute',
              left: '96px', // 72px left column + 24px gap (mr:3)
              top: 0,
              bottom: 0,
              width: '1px',
              bgcolor: '#E5E5E5',
              pointerEvents: 'none',
            }}
          />
          {weekends.map((day) => renderDayRow(day))}
        </Box>
      </Box>
    </Box>
  )
}
