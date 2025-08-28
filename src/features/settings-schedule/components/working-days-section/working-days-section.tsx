import { Box, Typography } from '@mui/material'
import { UniversalTimePicker } from '../../../../shared/components'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { enUS } from 'date-fns/locale'
import { useState } from 'react'
import type { IClub, IWorkingHours } from '../../../../app/providers/types/club'

const daysOfWeek = [
  { key: 'mon', label: 'Mon', dayOfWeek: 1, group: 'weekdays' },
  { key: 'tue', label: 'Tue', dayOfWeek: 2, group: 'weekdays' },
  { key: 'wed', label: 'Wed', dayOfWeek: 3, group: 'weekdays' },
  { key: 'thu', label: 'Thu', dayOfWeek: 4, group: 'weekdays' },
  { key: 'fri', label: 'Fri', dayOfWeek: 5, group: 'weekdays' },
  { key: 'sat', label: 'Sat', dayOfWeek: 6, group: 'weekends' },
  { key: 'sun', label: 'Sun', dayOfWeek: 0, group: 'weekends' },
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
    if (formData.working_hours && formData.working_hours.length > 0) {
      return daysOfWeek.map(day => {
        const workingHour = formData.working_hours?.find(wh => wh.day_of_week === day.dayOfWeek);
        return {
          key: day.key,
          enabled: workingHour ? workingHour.is_active : day.key !== 'sat' && day.key !== 'sun',
          start: workingHour ? new Date(workingHour.start_time) : null,
          end: workingHour ? new Date(workingHour.end_time) : null
        };
      });
    } else {
      return daysOfWeek.map(day => ({
        key: day.key,
        enabled: day.key !== 'sat' && day.key !== 'sun',
        start: null,
        end: null,
      }));
    }
  };

  const [workingDays, setWorkingDaysState] = useState<WorkingDay[]>(getInitialWorkingDays());

  // Update IClub's working_hours whenever workingDays changes
  const updateWorkingHours = (days: WorkingDay[]) => {
    const workingHours: IWorkingHours[] = days.map((day, index) => ({
      day_of_week: daysOfWeek[index].dayOfWeek,
      is_active: day.enabled,
      start_time: day.start || new Date(),
      end_time: day.end || new Date()
    }));
    handleFieldChange('working_hours', workingHours);
  };

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
      <Box key={day.key} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ width: '80px', display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ 
            color: day.enabled ? '#034C53' : '#94A3B8',
            fontSize: '14px', 
            mr: 2
          }}>
            {daysOfWeek[dayIndex].label}
          </Typography>
          
          {/* Toggle Switch */}
          <Box 
            sx={{ 
              display: 'inline-flex',
              width: 36,
              height: 20,
              position: 'relative',
              cursor: 'pointer'
            }}
            onClick={() => handleToggle(dayIndex)}
          >
            <Box 
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '34px',
                backgroundColor: day.enabled ? '#034C53' : '#E5E5E5',
                transition: 'background-color 0.2s ease'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                height: '16px',
                width: '16px',
                left: day.enabled ? '16px' : '4px',
                top: '2px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Typography sx={{ 
              fontSize: '12px', 
              color: '#64748B',
              mb: 0.5
            }}>
              From
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
              <UniversalTimePicker
                value={day.start}
                onChange={(e) => handleTimeChange(dayIndex, 'start', e)}
                disabled={!day.enabled}
                isIcon={true}
                textFieldProps={{
                  sx: {
                    '& .MuiInputBase-root': {
                      height: '40px',
                      borderRadius: '4px',
                      backgroundColor: day.enabled ? 'white' : '#F1F5F9',
                    },
                    width: '100%',
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ 
              fontSize: '12px', 
              color: '#64748B',
              mb: 0.5
            }}>
              To
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
              <UniversalTimePicker
                value={day.end}
                onChange={(e) => handleTimeChange(dayIndex, 'end', e)}
                disabled={!day.enabled}
                isIcon={true}
                textFieldProps={{
                  sx: {
                    '& .MuiInputBase-root': {
                      height: '40px',
                      borderRadius: '4px',
                      backgroundColor: day.enabled ? 'white' : '#F1F5F9',
                    },
                    width: '100%',
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
    <form style={{ width: '100%' }}>
      {/* Weekdays Section */}
      <Box mb={4}>
        <Typography 
          sx={{ 
            fontSize: '16px', 
            fontWeight: 500, 
            color: '#0F172A',
            mb: 2 
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
            fontWeight: 500, 
            color: '#0F172A',
            mb: 2 
          }}
        >
          Weekends
        </Typography>
        
        <Box>
          {weekends.map((day) => renderDayRow(day))}
        </Box>
      </Box>
    </form>
  )
}
