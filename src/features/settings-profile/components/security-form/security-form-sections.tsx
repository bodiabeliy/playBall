import { Box, FormControl, TextField, InputAdornment, IconButton } from '@mui/material'
import { useState } from 'react'

import ForgotPassword from '../../../../shared/assets/icons/forgot-password.svg?react'
import { Visibility } from '@mui/icons-material'

export type SecurityFormData = {
  current_password: string
  new_password: string
  confirm_password: string
}

type SectionProps = {
  formData: SecurityFormData
  handleFieldChange: <T extends keyof SecurityFormData>(field: T, value: SecurityFormData[T]) => void
  errors?: {
    current_password?: string
    new_password?: string
    confirm_password?: string
  }
}

export const SecuritySection = ({ formData, handleFieldChange, errors }: SectionProps) => {
  const [passwordVisible, setPasswordVisible] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false,
  })

  const togglePasswordVisibility = (field: keyof typeof passwordVisible) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <FormControl fullWidth sx={{ borderRadius: '12px' }}>
          <TextField
            type={passwordVisible.new_password ? 'text' : 'password'}
            value={formData.current_password}
            onChange={(e) => handleFieldChange('current_password', e.target.value)}
            fullWidth
            placeholder="Current Password"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            error={Boolean(errors?.new_password)}
            helperText={errors?.new_password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={passwordVisible.new_password ? 'hide the password' : 'display the password'}
                    onClick={() => togglePasswordVisibility('new_password')}
                    edge="end">
                    {passwordVisible.new_password ? <ForgotPassword /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <FormControl fullWidth sx={{ borderRadius: '12px' }}>
          <TextField
            type={passwordVisible.new_password ? 'text' : 'password'}
            value={formData.new_password}
            onChange={(e) => handleFieldChange('new_password', e.target.value)}
            fullWidth
            placeholder="Create New Password"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            error={Boolean(errors?.new_password)}
            helperText={errors?.new_password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={passwordVisible.new_password ? 'hide the password' : 'display the password'}
                    onClick={() => togglePasswordVisibility('new_password')}
                    edge="end">
                    {passwordVisible.new_password ? <ForgotPassword /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        <FormControl fullWidth sx={{ borderRadius: '12px' }}>
          <TextField
            type={passwordVisible.confirm_password ? 'text' : 'password'}
            value={formData.confirm_password}
            onChange={(e) => handleFieldChange('confirm_password', e.target.value)}
            fullWidth
            placeholder="Confirm Password"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            error={Boolean(errors?.confirm_password)}
            helperText={errors?.confirm_password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={passwordVisible.confirm_password ? 'hide the password' : 'display the password'}
                    onClick={() => togglePasswordVisibility('confirm_password')}
                    edge="end">
                    {passwordVisible.confirm_password ? <ForgotPassword /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </Box>
    </Box>
  )
}
