import { Link, useNavigate } from 'react-router'

import { Typography, Button, InputAdornment, TextField, Box, useTheme, IconButton } from '@mui/material'
import loginBg from '../shared/assets/images/login-bg.png'
import LogoIcon from '../shared/assets/icons/logo.svg?react'
import { getForgotPasswordRoute, getSignUpRoute } from '../shared/types/routes'
import { useMediaQuery } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../app/providers/store-helpers'
import { useFormValidation } from '../shared/hooks/use-form-field'
import type { IUserDto } from '../app/providers/types'
import { useEffect, useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { login } from '../app/services/UserService'
import { toast, ToastContainer } from 'react-toastify'
import { notificationMessageSelector, isErrorSelector } from '../app/providers/reducers/UserSlice'

export function LoginPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isError = useAppSelector(isErrorSelector)
  const notificationMessage = useAppSelector(notificationMessageSelector)

  const validateSignUp = (data: IUserDto) => ({
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) ? '' : 'Некоректна електронна пошта',
    password: !data.password
      ? "Поле обов'язкове"
      : data.password.length < 8
        ? 'Мінімум 8 символів'
        : !/[A-Za-z]/.test(data.password) || !/[0-9]/.test(data.password)
          ? 'Пароль має містити літери та цифри'
          : '',
  })

  const { formData, handleFieldChange, errors } = useFormValidation<IUserDto>(
    {
      email: '',
      password: '',
    },
    validateSignUp
  )

  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const [isValidated, setIsValidated] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  useEffect(() => {
    if (hasSubmitted) {
      if (isError) {
        toast.error(notificationMessage)
      } else {
        navigate('/')
      }
      setHasSubmitted(false)
    }
  }, [isError, notificationMessage, hasSubmitted])

  const submitForm = async () => {
    setIsValidated(true)
    const result = await dispatch(login(formData))
    if (result?.success) {
      navigate('/')
    } else {
      toast.error(result?.error)
    }
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
        <LogoIcon />
      </Box>
      <Box
        sx={{
          maxWidth: 600,
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
        <Typography variant="h5" color="rgba(21, 22, 24, 0.87)">
          Вхід
        </Typography>
        <Typography variant="body1" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Будь ласка, введіть свою електронну пошту, щоб увійти
        </Typography>
        <form style={{ width: '100%', marginTop: '16px' }}>
          <TextField
            label="Електронна пошта"
            variant="outlined"
            fullWidth
            sx={{
              mb: 4,
            }}
            value={formData?.email}
            onChange={(event) => handleFieldChange('email', event.target.value)}
            error={isValidated && !!errors.email}
            helperText={isValidated && errors.email}
          />
          <TextField
            label="Введіть пароль"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={(event) => handleFieldChange('password', event.target.value)}
            error={isValidated && !!errors.password}
            helperText={isValidated && errors.password}
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
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Link
            style={{
              color: '#0029d9',
              marginTop: '16px',
              display: 'block',
              textDecoration: 'underline',
              textDecorationColor: '#99a9f0',
            }}
            to={getForgotPasswordRoute()}>
            Забули пароль?
          </Link>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => submitForm()}
            sx={{
              mb: 2,
              mt: 4,
              padding: '12px 22px',
              boxShadow:
                '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
              textTransform: 'uppercase',
            }}>
            Увійти
          </Button>
        </form>
        <Typography variant="body2" align="left" sx={{ mt: 1, color: 'rgba(21, 22, 24, 0.6)' }}>
          Ще не маєте акаунта?
          <Link
            to={getSignUpRoute()}
            style={{
              color: '#0029d9',
              textDecoration: 'underline',
              textDecorationColor: '#99a9f0',
              marginLeft: '4px',
            }}>
            Зареєструватися
          </Link>
        </Typography>
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
