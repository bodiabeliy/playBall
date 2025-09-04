import { Box, Typography, Switch } from '@mui/material'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { enUS } from 'date-fns/locale'
import { useState, useCallback } from 'react'
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
  // Convert working_hours from IClub to WorkingDay format if available
  const getInitialWorkingDays = (): WorkingDay[] => {
    // Default time values for each day (ensuring start < end)
    const getDefaultTimes = (dayKey: string) => {
      switch (dayKey) {
        case 'mon':
          return { start: new Date('2024-01-01T08:00:00.000Z'), end: new Date('2024-01-01T18:00:00.000Z') };
        case 'tue':
          return { start: new Date('2024-01-01T08:30:00.000Z'), end: new Date('2024-01-01T19:00:00.000Z') };
        case 'wed':
          return { start: new Date('2024-01-01T09:00:00.000Z'), end: new Date('2024-01-01T17:30:00.000Z') };
        case 'thu':
          return { start: new Date('2024-01-01T08:00:00.000Z'), end: new Date('2024-01-01T20:00:00.000Z') };
        case 'fri':
          return { start: new Date('2024-01-01T07:30:00.000Z'), end: new Date('2024-01-01T18:30:00.000Z') };
        case 'sat':
          return { start: new Date('2024-01-01T10:00:00.000Z'), end: new Date('2024-01-01T16:00:00.000Z') };
        case 'sun':
          return { start: new Date('2024-01-01T10:30:00.000Z'), end: new Date('2024-01-01T17:00:00.000Z') };
        default:
          return { start: new Date('2024-01-01T09:00:00.000Z'), end: new Date('2024-01-01T17:00:00.000Z') };
      }
    };

    if (formData.working_hours && formData.working_hours.length > 0) {
      return daysOfWeek.map(day => {
        const workingHour = formData.working_hours?.find(wh => wh.day_of_week === day.dayOfWeek);
        const defaultTimes = getDefaultTimes(day.key);
        return {
          key: day.key,
          enabled: workingHour ? workingHour.is_active : day.key !== 'sat', // Sunday is enabled by default, only Saturday is disabled
          start: workingHour ? new Date(workingHour.start_time) : defaultTimes.start,
          end: workingHour ? new Date(workingHour.end_time) : defaultTimes.end
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
  };

  const [workingDays, setWorkingDaysState] = useState<WorkingDay[]>(getInitialWorkingDays());

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
          
          {/*  */}
          

          {/* Material UI Switch */}
          <Switch
            checked={day.enabled}
            onChange={() => handleToggle(dayIndex)}
            size="medium"
            sx={{
              width: 44,
              height: 24,
              padding: 0,
              '& .MuiSwitch-switchBase': {
                padding: 0,
                margin: '2px',
                transitionDuration: '300ms',
                color: '#ffffff',
                '&.Mui-checked': {
                  transform: 'translateX(20px)',
                  color: '#ffffff',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#0F766E',
                    opacity: 1,
                    border: 0,
                  },
                  '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                  },
                },
                '&.Mui-focusVisible .MuiSwitch-thumb': {
                  color: '#0F766E',
                  border: '6px solid #fff',
                },
                '&.Mui-disabled .MuiSwitch-thumb': {
                  color: '#f5f5f5',
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                  opacity: 0.3,
                },
              },
              '& .MuiSwitch-thumb': {
                boxSizing: 'border-box',
                width: 20,
                height: 20,
                boxShadow: '0 2px 4px 0 rgba(0,35,11,0.2)',
              },
              '& .MuiSwitch-track': {
                borderRadius: 24 / 2,
                backgroundColor: '#CBD5E1',
                opacity: 1,
                transition: 'background-color 300ms',
              },
            }}
          />
        </Box>
        
        {/* Time inputs */}
        <Box sx={{ 
          display: 'flex', 
          flex: 1, 
          gap: 3,
          alignItems: 'flex-start'
        }}>
          {/* From time */}
          <Box sx={{ flex: 1 }}>
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
                value={day.start}
                onChange={(newValue) => handleTimeChange(dayIndex, 'start', newValue)}
                disabled={!day.enabled}
                format="HH:mm"
                ampm={false}
                slots={{
                  openPickerIcon: AccessTimeIcon,
                }}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      '& .MuiInputBase-root': {
                        height: '44px',
                        borderRadius: '8px',
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
                value={day.end}
                onChange={(newValue) => handleTimeChange(dayIndex, 'end', newValue)}
                disabled={!day.enabled}
                format="HH:mm"
                ampm={false}
                slots={{
                  openPickerIcon: AccessTimeIcon,
                }}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      '& .MuiInputBase-root': {
                        height: '44px',
                        borderRadius: '8px',
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
        
        <Box>
          {weekdays.map((day) => renderDayRow(day))}
        </Box>
      </Box>
      
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
        
        <Box>
          {weekends.map((day) => renderDayRow(day))}
        </Box>
      </Box>
    </Box>
  )
}
