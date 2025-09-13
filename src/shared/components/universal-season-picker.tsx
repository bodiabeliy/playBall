import React, { useState, useEffect } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import { Box, Typography } from '@mui/material'
import type { DateRange } from '@mui/x-date-pickers-pro'
import { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

interface UniversalSeasonPickerProps {
  value: DateRange<Dayjs>;
  onChange: (value: DateRange<Dayjs>) => void;
  label?: string;
  placeholder?: string;
  format?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  isError?: boolean;
  errorMessage?: string;
}

export const UniversalSeasonPicker: React.FC<UniversalSeasonPickerProps> = ({
  value,
  onChange,
  label = 'Season',
  placeholder = "May 4, 2025 - June 22, 2025",
  format = 'MMM d, yyyy',
  disabled = false,
  minDate,
  maxDate,
  isError = false,
  errorMessage = ''
}) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Box>
      {label && (
        <Typography variant="body2" color="rgba(21, 22, 24, 0.6)" sx={{ mb: 2 }}>
          {label}
        </Typography>
      )}
      
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRangePicker
          value={value}
          onChange={onChange}
          format={format}
          calendars={2}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          disabled={disabled}
          minDate={minDate ? dayjs(minDate) : undefined}
          maxDate={maxDate ? dayjs(maxDate) : undefined}
          slots={{
            field: ({ startDate, endDate }) => {
              // Use value directly from props if startDate/endDate not provided
              const start = startDate || (value && value[0]);
              const end = endDate || (value && value[1]);
              
              // Format: "Oct 1, yyyy - Oct 5, yyyy" as shown in screenshot
              const displayValue = start && end 
                ? `${dayjs(start).format('MMM D, YYYY')} - ${dayjs(end).format('MMM D, YYYY')}`
                : '';
              
              return (
                <Box 
                  onClick={() => setOpen(true)}
                  sx={{ 
                    position: 'relative',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    component="input"
                    value={displayValue}
                    placeholder={placeholder}
                    readOnly
                    onClick={() => setOpen(true)}
                    sx={{
                      width: '100%',
                      height: '42px',
                      padding: '8px 14px',
                      paddingRight: '40px',
                      outline: 'none',
                      borderRadius: '12px',
                      // Match the orange border from the screenshot for selected dates
                      border: '1px solid #E5E5E5',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      backgroundColor: disabled ? '#F3F4F6' : '#fff',
                      color: disabled ? '#A0A0A0' : 'inherit',
                      '&:hover': {
                        border: isError ? '1px solid #FCA5A5' : '1px solid #CBD5E1',
                      },
                      '&:focus': {
                        border: isError ? '1px solid #FCA5A5' : '1px solid #034C53',
                        boxShadow: isError ? 'none' : '0 0 0 2px rgba(3, 76, 83, 0.1)',
                      },
                    }}
                  />
                  <Box
                    component="span"
                    sx={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748B',
                      pointerEvents: 'none',
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </Box>
                </Box>
              );
            },
          }}
          slotProps={{
            actionBar: {
              actions: ['clear', 'today', 'accept'],
              sx: {
                '& .MuiButton-root': {
                  color: '#034C53',
                }
              }
            },
            day: {
              sx: {
                '&.Mui-selected': {
                  backgroundColor: '#034C53 !important',
                  color: '#fff !important',
                  borderRadius: '50% !important',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#023940 !important',
                  },
                },
                '&.MuiPickersDay-dayOutsideMonth': {
                  color: '#A0A0A0',
                },
                '&.MuiPickersDay-dayWithinRange:not(.Mui-selected)': {
                  backgroundColor: '#e6f4f1 !important',
                  color: '#034C53',
                },
                '&.Mui-selected.MuiPickersDay-dayWithinRange': {
                  color: '#fff !important',
                  borderRadius: '50% !important',
                },
                '&.MuiPickersDay-root:hover': {
                  backgroundColor: 'rgba(3, 76, 83, 0.1)',
                },
                '&.MuiPickersDay-root.MuiPickersDay-today': {
                  border: '1px solid #034C53',
                  color: '#034C53',
                  fontWeight: 'bold',
                }
              }
            },
            nextIconButton: {
              sx: { color: '#64748B' }
            },
            previousIconButton: {
              sx: { color: '#64748B' }
            },
            calendarHeader: {
              sx: { 
                '& .MuiTypography-root': {
                  color: '#111827',
                  fontWeight: 500
                }
              }
            },
            popper: {
              sx: {
                // Center the calendar vertically
                '&.MuiPopper-root': {
                  transform: 'translateY(-50%) !important',
                  top: '50% !important',
                },
                '& .MuiPickersDay-root.Mui-selected': {
                  backgroundColor: '#034C53 !important',
                  color: 'white !important',
                },
                '& .MuiDateRangePickerDay-rangeIntervalDayHighlight': {
                  backgroundColor: '#e6f4f1 !important'
                }
              }
            }
          }}
        />
      </LocalizationProvider>
      
      {isError && errorMessage && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  )
}

// A simpler version that handles state internally
interface SimpleUniversalSeasonPickerProps extends Omit<UniversalSeasonPickerProps, 'value' | 'onChange'> {
  initialValue?: DateRange<Dayjs>;
  onRangeChange?: (value: DateRange<Dayjs>) => void;
}

export const SimpleUniversalSeasonPicker: React.FC<SimpleUniversalSeasonPickerProps> = ({
  initialValue = [null, null],
  onRangeChange,
  ...props
}) => {
  // Ensure initialValue is properly converted to Dayjs objects if they aren't already
  const processedInitialValue: DateRange<Dayjs> = [
    initialValue[0] ? (dayjs.isDayjs(initialValue[0]) ? initialValue[0] : dayjs(initialValue[0])) : null,
    initialValue[1] ? (dayjs.isDayjs(initialValue[1]) ? initialValue[1] : dayjs(initialValue[1])) : null,
  ];
  
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>(processedInitialValue);

  // Update internal state if initialValue changes externally
  useEffect(() => {
    // Check if the dates are different by comparing their string representations
    const initialStart = initialValue[0] ? initialValue[0].format('YYYY-MM-DD') : null;
    const initialEnd = initialValue[1] ? initialValue[1].format('YYYY-MM-DD') : null;
    const currentStart = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : null;
    const currentEnd = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : null;
    
    if (initialStart !== currentStart || initialEnd !== currentEnd) {
      setDateRange(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  const handleChange = (newValue: DateRange<Dayjs>) => {
    setDateRange(newValue);
    if (onRangeChange) {
      onRangeChange(newValue);
    }
  };

  return (
    <UniversalSeasonPicker
      value={dateRange}
      onChange={handleChange}
      {...props}
    />
  );
};

export default UniversalSeasonPicker;