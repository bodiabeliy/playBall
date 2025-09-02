import { TextField, InputAdornment } from '@mui/material'
import type { SxProps } from '@mui/material'
import { Search, Close } from '@mui/icons-material'
import { useState, useEffect } from 'react'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  fullWidth?: boolean
  isStartAdornment?: boolean
  sx?: SxProps
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search',
  fullWidth = false,
  isStartAdornment = true,
  sx,
}: SearchFieldProps) {
  const [localValue, setLocalValue] = useState(value)
  
  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])
  
  // Handle input change with immediate feedback
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange(newValue)
  }
  
  // Clear search function
  const handleClearSearch = () => {
    setLocalValue('')
    onChange('')
  }
  
  return (
    <TextField
      placeholder={placeholder}
      value={localValue}
      onChange={handleInputChange}
      variant="outlined"
      fullWidth={fullWidth}
      InputProps={{
        startAdornment: isStartAdornment ? (
          <InputAdornment position="start">
            <Search sx={{ fontSize: 24, color: '#6e6e6e' }} />
          </InputAdornment>
        ) : null,
        endAdornment: localValue ? (
          <InputAdornment position="end">
            <Close 
              sx={{ fontSize: 18, color: '#6e6e6e', cursor: 'pointer' }}
              onClick={handleClearSearch}
            />
          </InputAdornment>
        ) : !isStartAdornment ? (
          <InputAdornment position="end">
            <Search sx={{ fontSize: 24, color: '#6e6e6e' }} />
          </InputAdornment>
        ) : null,
        sx: {
          borderRadius: '8px',
          background: '#fff',
          fontSize: '1rem',
          paddingRight: '12px',
          paddingLeft: '20px',
          height: '35px',

          '& input': {
            fontSize: '1rem',
            color: '#444',
            padding: '16px 0',
          },
          '& fieldset': {
            borderColor: '#bbb',
            borderWidth: '1px',
            transition: 'border-color 0.2s ease-in-out',
          },
          '&:hover fieldset': {
            borderColor: '#bbb',
          },
          '&.Mui-focused fieldset': {
            borderWidth: '1.5px',
          },
          boxShadow: 'none',
          transition: 'box-shadow 0.2s ease-in-out',
        },
      }}
      inputProps={{
        style: {
          fontSize: '1rem',
          color: '#444',
          padding: '16px 0',
        },
      }}
      sx={{
        width: 240,
        borderRadius: '8px',
        background: '#fff',
        boxShadow: 'none',
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          background: '#fff',
          boxShadow: 'none',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor:'#bbb',
          borderWidth: '1px',
          transition: 'border-color 0.2s ease-in-out',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#bbb',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: '1.5px',
        },
        ...sx,
      }}
    />
  )
}
