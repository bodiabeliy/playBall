import React, { useState } from 'react'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import type { TimePickerProps } from '@mui/x-date-pickers/TimePicker'
import type { TextFieldProps } from '@mui/material'

interface UniversalTimePickerProps extends Omit<TimePickerProps<Date>, 'slotProps'> {
  textFieldProps?: Partial<TextFieldProps>
  isIcon?: boolean
}

export const UniversalTimePicker: React.FC<UniversalTimePickerProps> = ({
  textFieldProps,
  isIcon = true,
  ...timePickerProps
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <TimePicker
      {...timePickerProps}
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      slotProps={{
        textField: {
          InputProps: {
            readOnly: true,
            ...(!isIcon && {
              endAdornment: null,
            }),
          },
          onClick: () => setIsOpen(true),
          sx: {
            cursor: 'pointer',
            '& .MuiInputBase-root': {
              cursor: 'pointer',
            },
            ...textFieldProps?.sx,
          },
          ...textFieldProps,
        },
        digitalClockSectionItem: {
          sx: {
            backgroundColor: 'transparent',
            color: 'rgba(21, 22, 24, 0.87)',
            borderRadius: '50%',
            height: '36px',
            width: '36px',
            margin: '0 auto',
            '&:hover': {
              backgroundColor: 'rgba(0, 41, 217, 0.08)',
            },
            '&.Mui-selected': {
              backgroundColor: '#0029d9',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#0020A8',
              },
            },
          },
        },
        actionBar: {
          sx: {
            '& .MuiButton-root': {
              color: '#0029d9',
            },
          },
        },
      }}
    />
  )
}
