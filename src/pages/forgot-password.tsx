import { Typography, Button, TextField, Box, useMediaQuery, useTheme, InputAdornment } from '@mui/material'
import loginBg from '../shared/assets/images/login-bg.png'
import LogoIcon from '../shared/assets/icons/logo.svg?react'

import { useNavigate } from 'react-router'
import { useFormValidation } from '../shared/hooks/use-form-field'
import type { IUserDto } from '../app/providers/types'
import { CONFIRMATION_TYPES } from '../app/services/api/constants'

export function ForgotPasswordPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()

  const validateSignUp = (data: IUserDto) => ({
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data?.email?.trim()) ? '' : 'Будь ласка, введіть дійсні дані',
    password: '',
  })

  const { formData, handleFieldChange } = useFormValidation<IUserDto>(
    {
      email: '',
    },
    validateSignUp
  )

  const submitForm = () => {
    navigate('/code-confirmation', { state: { formData, type: CONFIRMATION_TYPES.resetPassword } })
  }

  return (
    <Box
      sx={{
        backgroundImage: isMobile ? 'none' : `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: isMobile ? 'rgba(255, 255, 255, 1)' : 'none',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '66px',
          justifySelf: 'flex-start',
        }}>
      </Box>
      <Box
        sx={{
           maxWidth: 400,
          width: '100%',
          mx: 'auto',
          my: isMobile ? 0 : 'auto',
          mt: isMobile ? 2 : 'auto',
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: isMobile ? 0 : 3,
          p: isMobile ? 2 : 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}>
          <Box sx={{mx:"auto"}}>
             <LogoIcon />
          </Box>
        <Typography sx={{textAlign:"center",width:"270px", mx:"auto"}} variant="body1" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Enter the email address associated with your account and we’ll send you a link to reset your password.
        </Typography>
        <form style={{ width: '100%', marginTop: '16px' }}>
          <TextField
            // label="Електронна пошта"
            variant="outlined"
            placeholder='Email'
            fullWidth
            onChange={(event) => handleFieldChange('email', event.target.value)}
            // error={!!errors.email}
            // helperText={errors.email}
            sx={{
              mb: 4,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/* {errors.email ? <ErrorOutlineOutlinedIcon sx={{ color: '#D32F2F' }} /> : ''} */}
                </InputAdornment>
              ),
            }}
          />
          <Button
            onClick={() => submitForm()}
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mb: 2,
              bgcolor:"#034C53",
              padding: '12px 22px',
              boxShadow:
                '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
              textTransform: 'uppercase',
            }}>
            Send reset link
          </Button>
        </form>
      </Box>
    </Box>
  )
}
