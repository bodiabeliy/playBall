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

const hideWatermarkStyles = `
 div.MuiDateRangeCalendar-root > div[style*="position: absolute"] {
  opacity: 0 !important;
}
`;

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
  // Insert style element to hide watermark
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = hideWatermarkStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
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
          calendars={1}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          disabled={disabled}
          minDate={minDate ? dayjs(minDate) : undefined}
          maxDate={maxDate ? dayjs(maxDate) : undefined}
          dayOfWeekFormatter={(day) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][parseInt(day.toString()) % 7]}
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
                      borderRadius: '8px',
                      // Match the orange border from the screenshot for selected dates
                      border: '1px solid #E5E5E5',
                      fontSize: '14px',
                      fontWeight: 400,
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      backgroundColor: disabled ? '#F3F4F6' : '#fff',
                      color: disabled ? '#A0A0A0' : '#111827',
                      '&:hover': {
                        border: '1px solid #CBD5E1',
                      },
                     
                    }}
                  />
                  <Box
                    component="span"
                    sx={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color:'#64748B',
                      pointerEvents: 'none',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.66669 1.66699V4.16699M13.3334 1.66699V4.16699M2.91669 7.57533H17.0834M3.33335 3.33366H16.6667C17.1269 3.33366 17.5 3.70671 17.5 4.16699V16.667C17.5 17.1273 17.1269 17.5003 16.6667 17.5003H3.33335C2.87307 17.5003 2.50002 17.1273 2.50002 16.667V4.16699C2.50002 3.70671 2.87307 3.33366 3.33335 3.33366Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                  textTransform: 'capitalize',
                  fontSize: '14px',
                  fontWeight: 500,
                },
                '& .MuiButton-root:first-of-type': {
                  color: '#111827',
                },
                '& .MuiButton-root:last-of-type': {
                  color: '#034C53',
                  fontWeight: 500,
                }
              }
            },
            mobilePaper: {
              sx: {
                '& .MuiPickersDay-root.Mui-selected': {
                  backgroundColor: '#00676F !important',
                  color: '#fff !important',
                  borderRadius: '4px !important',
                  fontWeight: 600,
                  border: '1px solid #CDFA50 !important',
                },
                '& .MuiPickersDay-dayWithinRange:not(.Mui-selected)': {
                  backgroundColor: '#E6F4F1 !important',
                  color: '#034C53',
                  borderRadius: '0px !important',
                },
                '& .MuiPickersDay-root.MuiPickersDay-rangeEnd': {
                  backgroundColor: '#00676f !important',
                  color: 'white !important',
                  borderTopRightRadius: '4px !important', 
                  borderBottomRightRadius: '4px !important',
                  border: '1px solid #CDFA50 !important',
                  borderRight: '3px solid #15c28a',
                },
                '& .MuiPickersDay-root.MuiPickersDay-rangeStart': {
                  backgroundColor: '#00676f !important',
                  color: 'white !important',
                  borderTopLeftRadius: '4px !important',
                  borderBottomLeftRadius: '4px !important',
                  border: '1px solid #CDFA50 !important',
                }
              }
            },
            day: {
              sx: {
                margin: '0',
                borderRadius: '0',
                fontSize: '14px',
                width: '32px',
                height: '32px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&.Mui-selected': {
                  backgroundColor: '#00676F !important',
                  color: '#fff !important',
                  borderRadius: '4px !important',
                  fontWeight: 600,
                  border: '1px solid #CDFA50 !important',
                  '&:hover': {
                    backgroundColor: '#023940 !important',
                  },
                },
                '&.MuiPickersDay-dayOutsideMonth': {
                  color: '#A0A0A0',
                },
                '&.MuiPickersDay-dayWithinRange:not(.Mui-selected)': {
                  backgroundColor: '#E6F4F1 !important',
                  color: '#034C53',
                  borderRadius: '0px !important',
                },
                '&:first-of-type.MuiPickersDay-dayWithinRange': {
                
                },
                '&:last-of-type.MuiPickersDay-dayWithinRange': {
                
                },
                '&.Mui-selected.MuiPickersDay-dayWithinRange': {
                  color: '#fff !important',
                  borderRadius: '4px !important',
                },
                '&.MuiPickersDay-dayInsideRangeInterval': {
                  backgroundColor: '#E6F4F1 !important',
                },
                '&.MuiPickersDay-root:hover': {
                  backgroundColor: 'rgba(3, 76, 83, 0.1)',
                  borderRadius: '4px',
                },
                '&.MuiPickersDay-root.MuiPickersDay-today': {
                  border: 'none',
                  color: '#034C53',
                  fontWeight: 600,
                  backgroundColor: 'rgba(3, 76, 83, 0.1) !important',
                  borderRadius: '4px',
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
                  fontWeight: 500,
                  fontSize: '16px'
                }
              }
            },
            popper: {
              sx: {
                // Calendar positioning
                '&.MuiPopper-root': {
                  zIndex: 1400,
                  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden'
                },
                // Hide only the MUI X Missing license key watermark
                '& div[style*="MUI X Missing license key"]': {
                  display: 'none !important',
                },
                '& .MuiPickersDay-root.Mui-selected, & .MuiPickersDay-dayWithinRange.Mui-selected': {
                  backgroundColor: '#034C53 !important',
                  color: 'white !important',
                  border: '1px solid #CDFA50 !important',
                },
                '& .MuiDateRangePickerDay-rangeIntervalDayHighlight': {
                  backgroundColor: '#E6F4F1 !important'
                },
                '& .MuiDateRangePickerDay-day.MuiDateRangePickerDay-dayInsideRangeInterval': {
                  backgroundColor: 'transparent',
                },
                '& .MuiDateRangePickerDay-dayInsideRangeInterval:not(.MuiButtonBase-root)': {
                  backgroundColor: '#E6F4F1',
                },
                '& .MuiPickersDay-root.MuiPickersDay-rangeEnd, & .MuiPickersDay-root.MuiPickersDay-rangeStart': {
                  backgroundColor: '#034C53 !important',
                  color: '#fff !important',
                },
                // Specific styles for the end of range selection
                '& .MuiPickersDay-root:has(+ .Mui-selected)': {
                  borderTopRightRadius: '0 !important',
                  borderBottomRightRadius: '0 !important',
                },
                '& .MuiPickersDay-root.Mui-selected:last-child': {
                  borderTopRightRadius: '4px !important',
                  borderBottomRightRadius: '4px !important',
                  backgroundColor: '#00676f !important',
                },
                '& .MuiPickersDay-root.Mui-selected:first-of-type': {
                  borderTopLeftRadius: '4px !important',
                  borderBottomLeftRadius: '4px !important',
                  backgroundColor: '#00676f !important',
                },
                // Styling for range selection
                '& .MuiPickersDay-root.MuiPickersDay-rangeEnd': {
                  backgroundColor: '#00676f !important',
                  color: 'white !important',
                  borderTopRightRadius: '4px !important', 
                  borderBottomRightRadius: '4px !important',
                  border: '1px solid #CDFA50 !important',
                  borderRight: '3px solid #15c28a',
                },
                '& .MuiPickersDay-root.MuiPickersDay-rangeStart': {
                  backgroundColor: '#00676f !important',
                  color: 'white !important',
                  borderTopLeftRadius: '4px !important',
                  borderBottomLeftRadius: '4px !important',
                  border: '1px solid #CDFA50 !important',
                },
                // General selected day styling is already handled above
                '& .MuiPickersLayout-root': {
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  width: '320px',
                  '@media (max-width: 600px)': {
                    width: '100%',
                    maxWidth: '100vw',
                  },
                },
                '& .MuiPickersCalendarHeader-root': {
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  marginTop: '8px'
                },
                '& .MuiDayCalendar-header': {
                  paddingLeft: '12px',
                  paddingRight: '12px',
                },
                '& .MuiDayCalendar-monthContainer': {
                  paddingLeft: '12px',
                  paddingRight: '12px',
                },
                '& .MuiPickersLayout-actionBar': {
                  padding: '16px 24px',
                  borderTop: '1px solid #E5E7EB',
                },
                '@media (max-width: 600px)': {
                  '& .MuiPickersDay-root.Mui-selected': {
                    backgroundColor: '#00676F !important',
                    color: '#fff !important',
                    borderRadius: '4px !important',
                    fontWeight: 600,
                    border: '1px solid #CDFA50 !important',
                  },
                  '& .MuiPickersDay-dayWithinRange:not(.Mui-selected)': {
                    backgroundColor: '#E6F4F1 !important',
                    color: '#034C53',
                    borderRadius: '0px !important',
                  },
                  '& .MuiPickersDay-root.MuiPickersDay-rangeEnd': {
                    backgroundColor: '#00676f !important',
                    color: 'white !important',
                    borderTopRightRadius: '4px !important', 
                    borderBottomRightRadius: '4px !important',
                    border: '1px solid #CDFA50 !important',
                    borderRight: '3px solid #15c28a',
                  },
                  '& .MuiPickersDay-root.MuiPickersDay-rangeStart': {
                    backgroundColor: '#00676f !important',
                    color: 'white !important',
                    borderTopLeftRadius: '4px !important',
                    borderBottomLeftRadius: '4px !important',
                    border: '1px solid #CDFA50 !important',
                  }
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