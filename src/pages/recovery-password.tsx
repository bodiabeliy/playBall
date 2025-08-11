
import { useState } from 'react'

import { useLocation, useNavigate } from 'react-router'
import { useMediaQuery } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../app/providers/store-helpers'
import { useFormValidation } from '../shared/hooks/use-form-field'
import type { IUserRecoveryPassword } from '../app/providers/types'

import { Typography, Button, InputAdornment, TextField, Box, useTheme, IconButton } from '@mui/material'
import loginBg from '../shared/assets/images/login-bg.png'
import LogoIcon from '../shared/assets/icons/logo.svg?react'
import ForgotPassword from '../shared/assets/icons/forgot-password.svg?react'


import { Visibility } from '@mui/icons-material'
import { resetPassword } from '../app/services/UserService'
import { toast, ToastContainer } from 'react-toastify'
import { notificationMessageSelector } from '../app/providers/reducers/UserSlice'

export function RecoveryPasswordPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const notificationMessage = useAppSelector(notificationMessageSelector)

  const recoveryCode = location?.state?.formData?.code
  const recoveryEmail = location?.state?.formData?.email

  const dispatch = useAppDispatch()

  const validateSignUp = (data: IUserRecoveryPassword) => ({
    password: !data.password
      ? "Поле обов'язкове"
      : data.password.length < 8
        ? 'Мінімум 8 символів'
        : !/[A-Za-z]/.test(data.password) || !/[0-9]/.test(data.password)
          ? 'Пароль має містити літери та цифри'
          : '',
    recoveryPassword: !data.password
      ? "Поле обов'язкове"
      : data.password.length < 8
        ? 'Мінімум 8 символів'
        : !/[A-Za-z]/.test(data.password) || !/[0-9]/.test(data.password)
          ? 'Пароль має містити літери та цифри'
          : '',
  })

  const { formData, handleFieldChange, isReadyForSubmit } = useFormValidation<IUserRecoveryPassword>(
    {
      password: '',
      recoveryPassword: '',
    },
    validateSignUp
  )

  const [showPassword, setShowPassword] = useState(false)
  const [showRecoveryPassword, setShowRecoveryPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleClickShowRecoveryPassword = () => setShowRecoveryPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const submitForm = async () => {
    await dispatch(resetPassword(recoveryEmail, recoveryCode, formData?.password))
    await navigate('/')
    await toast.success(notificationMessage)
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
        <Typography sx={{textAlign:"center",width:"250px", mx:"auto"}} variant="body1" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Your password must be at least 8 characters long and include a number or symbol
        </Typography>
        <form style={{ width: '100%', marginTop: '16px' }}>
          <TextField
            // label="Введіть пароль"
            variant="outlined"
            placeholder='New Password'
            fullWidth
            value={formData.password}
            onChange={(event) => handleFieldChange('password', event.target.value)}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end">
                    {showPassword ? <ForgotPassword /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            sx={{ mt: 2 }}
            // label="Введіть пароль повторно"
            variant="outlined"
            fullWidth
            placeholder='Confirm Password'
            value={formData.recoveryPassword}
            onChange={(event) => handleFieldChange('recoveryPassword', event.target.value)}
            type={showRecoveryPassword ? 'text' : 'password'}
            error={formData.password != formData.recoveryPassword}
            helperText={formData.password != formData.recoveryPassword && 'Паролі не співпадають!'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showRecoveryPassword ? 'hide the password' : 'display the password'}
                    onClick={handleClickShowRecoveryPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end">
                    {showRecoveryPassword ? <ForgotPassword /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            color="primary"
            disabled={!isReadyForSubmit || formData.password != formData.recoveryPassword}
            fullWidth
            onClick={() => submitForm()}
            sx={{
              mb: 2,
              mt: 4,
              bgcolor:"#034C53",
              padding: '12px 22px',
              boxShadow:
                '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
              textTransform: 'uppercase',
            }}>
            Reset password
          </Button>
        </form>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="colored"
      />
    </Box>
  )
}
