import { TextField, InputAdornment } from '@mui/material'
import type { SxProps } from '@mui/material'
import { Search } from '@mui/icons-material'
import { useLocation } from 'react-router'

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

  const location = useLocation()
  
  return (
    <TextField
      placeholder={placeholder +" " + location.pathname.split("/")[1]}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      fullWidth={fullWidth}
      InputProps={{
        startAdornment: isStartAdornment ? (
          <InputAdornment position="start">
            <Search sx={{ fontSize: 24, color: '#6e6e6e' }} />
          </InputAdornment>
        ) : null,
        endAdornment: !isStartAdornment ? (
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
          },
          '&:hover fieldset': {
            borderColor: '#bbb',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#bbb',
          },
          boxShadow: 'none',
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
        width:240,
        borderRadius: '8px',
        background: '#fff',
        boxShadow: 'none',
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          background: '#fff',
          boxShadow: 'none',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#bbb',
          borderWidth: '1px',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#bbb',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#bbb',
        },
        ...sx,
      }}
    />
  )
}
