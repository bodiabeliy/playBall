import React, { useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField'
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField'
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { Box, Stack, Typography } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import type { DateRange } from '@mui/x-date-pickers-pro'
import dayjs, { Dayjs } from 'dayjs'

// Types for different display modes
type DisplayMode = 'single' | 'multi' | 'datetime';

interface UniversalDateTimeRangePickerProps {
  value: DateRange<Dayjs>;
  onChange: (value: DateRange<Dayjs>) => void;
  startLabel?: string;
  endLabel?: string;
  singleLabel?: string;
  format?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  displayMode?: DisplayMode;
  startTextFieldProps?: Partial<TextFieldProps>;
  endTextFieldProps?: Partial<TextFieldProps>;
  singleTextFieldProps?: Partial<TextFieldProps>;
}

export const UniversalDateTimeRangePicker: React.FC<UniversalDateTimeRangePickerProps> = ({
  value,
  onChange,
  startLabel = 'Start',
  endLabel = 'End',
  singleLabel = 'Date Range',
  format = 'MM/dd/yyyy',
  disabled = false,
  minDate,
  maxDate,
  displayMode = 'multi',
  startTextFieldProps,
  endTextFieldProps,
  singleTextFieldProps
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {displayMode === 'single' ? (
        // Single input version (compact)
        <SingleInputDateRangeField
          label={singleLabel}
          value={value}
          onChange={onChange}
          format={format}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          slotProps={{
            textField: {
              size: "small",
              sx: {
                cursor: 'pointer',
                '& .MuiInputBase-root': {
                  cursor: 'pointer',
                  borderRadius: '12px',
                  height: '42px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E5E5E5',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#CBD5E1',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#034C53',
                  borderWidth: '1px',
                },
                ...singleTextFieldProps?.sx
              },
              ...singleTextFieldProps
            },
            
          }}
        />
      ) : displayMode === 'datetime' ? (
        // Date Time Range Picker
        <DemoContainer components={['DateTimeRangePicker']}>
          <DateTimeRangePicker
            value={value}
            onChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
          />
        </DemoContainer>
      ) : (
        // Multi input version (two separate fields)
        <MultiInputDateRangeField
          value={value}
          onChange={onChange}
          format={format}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          slotProps={{
            textField: ({ position }) => ({
              label: position === 'start' ? startLabel : endLabel,
              size: "small",
              sx: {
                cursor: 'pointer',
                '& .MuiInputBase-root': {
                  cursor: 'pointer',
                  borderRadius: '12px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E2E8F0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#CBD5E1',
                },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#034C53 !important',
                  borderWidth: '1px',
                },
                ...(position === 'start' ? startTextFieldProps?.sx : endTextFieldProps?.sx)
              },
              ...(position === 'start' ? startTextFieldProps : endTextFieldProps)
            }),
            
          }}
        />
      )}
    </LocalizationProvider>
  )
}

// A simpler version that handles state internally
interface SimpleUniversalDateTimeRangePickerProps extends Omit<UniversalDateTimeRangePickerProps, 'value' | 'onChange'> {
  initialValue?: DateRange<Dayjs>;
  onRangeChange?: (value: DateRange<Dayjs>) => void;
}

export const SimpleUniversalDateTimeRangePicker: React.FC<SimpleUniversalDateTimeRangePickerProps> = ({
  initialValue = [null, null],
  onRangeChange,
  ...props
}) => {
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>(initialValue);

  const handleChange = (newValue: DateRange<Dayjs>) => {
    setDateRange(newValue);
    if (onRangeChange) {
      onRangeChange(newValue);
    }
  };

  return (
    <UniversalDateTimeRangePicker
      value={dateRange}
      onChange={handleChange}
      {...props}
    />
  );
};

// Example usage component
export const DateRangePickerDemo = () => {
  const [value, setValue] = useState<DateRange<Dayjs>>([null, null]);
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <SingleInputDateRangeField 
          label="Single Input (Departure - Return)" 
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
        
        <MultiInputDateRangeField
          value={value}
          onChange={(newValue) => setValue(newValue)}
          slotProps={{
            textField: ({ position }) => ({
              label: position === 'start' ? 'Departure' : 'Return',
            }),
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

// Named export for the component
export default UniversalDateTimeRangePicker
