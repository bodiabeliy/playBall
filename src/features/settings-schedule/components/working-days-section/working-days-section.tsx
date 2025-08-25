import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { UniversalTimePicker } from '../../../../shared/components'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { uk } from 'date-fns/locale'
import { useState } from 'react'
import type { IClub, IWorkingHours } from '../../../../app/providers/types/club'

const daysOfWeek = [
  { key: 'mon', label: 'Пн', dayOfWeek: 1 },
  { key: 'tue', label: 'Вт', dayOfWeek: 2 },
  { key: 'wed', label: 'Ср', dayOfWeek: 3 },
  { key: 'thu', label: 'Чт', dayOfWeek: 4 },
  { key: 'fri', label: 'Пт', dayOfWeek: 5 },
  { key: 'sat', label: 'Сб', dayOfWeek: 6 },
  { key: 'sun', label: 'Нд', dayOfWeek: 0 },
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

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <form style={{ width: '100%' }}>
      <Box mb={3}>
        <Box display="flex" flexDirection="column" gap={3}>
          {workingDays.map((day, idx) => (
            <Box key={day.key} display="flex" alignItems="center" gap={1}>
              
              <Box 
                component="span"
                sx={{ 
                  display: 'inline-flex',
                  width: 42,
                  height: 24,
                  position: 'relative',
                  marginRight: 1
                }}
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
                  onClick={() => handleToggle(idx)}
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
              <Typography sx={{ width: isMobile ? 20 : 28 }}>{daysOfWeek[idx].label}</Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                <UniversalTimePicker
                  value={day.start}
                  onChange={(e) => handleTimeChange(idx, 'start', e)}
                  disabled={!day.enabled}
                  isIcon={false}
                  textFieldProps={{
                    sx: {
                      '& .MuiInputBase-root': {
                        minHeight: isMobile ? 'auto' : 48,
                        height: isMobile ? '40px' : 48,
                      },
                      width: 120,
                    },
                  }}
                />
                <Typography sx={{ mx: isMobile ? 0 : 1 }}>—</Typography>
                <UniversalTimePicker
                  value={day.end}
                  onChange={(e) => handleTimeChange(idx, 'end', e)}
                  disabled={!day.enabled}
                  isIcon={false}
                  textFieldProps={{
                    sx: {
                      '& .MuiInputBase-root': {
                        minHeight: isMobile ? 'auto' : 48,
                        height: isMobile ? '40px' : 48,
                      },
                      width: 120,
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
          ))}
        </Box>
      </Box>
    </form>
  )
}
