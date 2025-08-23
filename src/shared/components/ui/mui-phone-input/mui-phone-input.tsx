import { MenuItem, Select, InputAdornment, TextField } from '@mui/material'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input'

type CountryOption = string | { value: string; label: string }

type MuiPhoneInputProps = {
  value: string
  onChange: (value: string | undefined) => void
  options: string[]
  labels?: Record<string, string>
  phoneValue?: string
  onPhoneChange?: (value: string) => void
  placeholder?: string
  error?: boolean
  helperText?: string
  disabled?: boolean
  required?: boolean
}

export const MuiPhoneInput = (props: MuiPhoneInputProps) => {
  const {
    value,
    onChange,
    options,
    labels = {},
    phoneValue = '',
    onPhoneChange,
    placeholder = 'Enter phone number',
    error = false,
    helperText = '',
    disabled = false,
    required = false,
    ...rest
  } = props

  const countryOptions = Array.isArray(options) && options.length > 0 ? options : getCountries()

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onPhoneChange) {
      onPhoneChange(event.target.value)
    }
  }

  const renderCountrySelect = () => (
    <Select
      value={value || ''}
      onChange={(e) => {
        const val = e.target.value
        onChange(typeof val === 'string' ? val : undefined)
      }}
      disabled={disabled}
      displayEmpty
      variant="standard"
      sx={{
        minWidth: 90,
        '.MuiSelect-standard': {
          paddingLeft: '5px',
          paddingRight: '5px',
          paddingY: '8px',
          display: 'flex',
          alignItems: 'center',
        },
        '&:before, &:after': { display: 'none' },
      }}
      renderValue={(selected) => {
        let code: string | undefined
        if (typeof selected === 'string') {
          code = selected
        }
        if (!code) return null
        return (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`}
              alt={code}
              width={24}
              height={18}
              style={{ objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}
            />
            {/* @ts-expect-error: Library expects CountryCode, but only string is available */}+
            {getCountryCallingCode(code as string)}
          </span>
        )
      }}
      {...rest}>
      {countryOptions.map((option: CountryOption) => {
        if (typeof option === 'string') {
          const code = option
          const label = (labels && labels[option]) || option
          return (
            <MenuItem value={code} key={code} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span className={`PhoneInputCountryIcon PhoneInputCountryIcon--${code}`} style={{ marginRight: 8 }}>
                <img
                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`}
                  alt={code}
                  width={24}
                  height={18}
                  style={{ objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }}
                />
              </span>
              {/* @ts-expect-error: Library expects CountryCode, but only string is available */}
              {label} +{getCountryCallingCode(code as string)}
            </MenuItem>
          )
        } else if (option && typeof option === 'object' && 'value' in option && 'label' in option) {
          const code = option.value as string
          const label = option.label as string
          return (
            <MenuItem value={code} key={code} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span className={`PhoneInputCountryIcon PhoneInputCountryIcon--${code}`} style={{ marginRight: 8 }}>
                <img
                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${code}.svg`}
                  alt={code}
                  width={24}
                  height={18}
                  style={{ objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }}
                />
              </span>
              {/* @ts-expect-error: Library expects CountryCode, but only string is available */}
              {label} +{getCountryCallingCode(code as string)}
            </MenuItem>
          )
        }
        return null
      })}
    </Select>
  )

  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      value={phoneValue}
      onChange={handlePhoneChange}
      error={error}
      helperText={helperText}
      disabled={disabled}
      required={required}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ marginRight: 0, marginLeft: 0 }}>
            {renderCountrySelect()}
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          '& fieldset': {
            borderColor: error ? 'error.main' : 'rgba(0, 0, 0, 0.23)',
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderColor: error ? 'error.main' : 'rgba(0, 0, 0, 0.87)',
          },
          '&.Mui-focused fieldset': {
            borderColor: error ? 'error.main' : 'primary.main',
            borderWidth: '2px',
          },
          '&.Mui-disabled fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
          },
        },
        '& .MuiInputAdornment-root': {
          height: '100%',
          maxHeight: 'none',
          '& .MuiSelect-select': {
            paddingRight: '24px',
            minHeight: 'auto',
          },
        },
        '& .MuiInputBase-input': {
          height: '1.4375em',
          padding: '16.5px 14px',
        },
      }}
    />
  )
}
