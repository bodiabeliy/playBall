import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { registerUser } from '../app/services/UserService'
import { useAppDispatch, useAppSelector } from '../app/providers/store-helpers'

import type { IUser } from '../app/providers/types/user'
import { getLoginRoute } from '../shared/types/routes'

import PhoneInput from 'react-phone-number-input'

import { useFormValidation } from '../shared/hooks/use-form-field'
import { Visibility, VisibilityOff } from '@mui/icons-material'


import { Typography, Button, InputAdornment, TextField, Box, useTheme, useMediaQuery, IconButton } from '@mui/material'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import loginBg from '../shared/assets/images/login-bg.png'
import LogoIcon from '../shared/assets/icons/logo.svg?react'
import { CONFIRMATION_TYPES } from '../app/services/api/constants'
import { toast, ToastContainer } from 'react-toastify'
import { notificationMessageSelector, isErrorSelector } from '../app/providers/reducers/UserSlice'

export function SignUpPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isError = useAppSelector(isErrorSelector)
  const notificationMessage = useAppSelector(notificationMessageSelector)

  const validateSignUp = (data: IUser) => ({
    firstname: !data.firstname.trim()
      ? "Поле обов'язкове"
      : /^[a-zA-Zа-яА-ЯёЁіІїЇєЄ'’\- ]+$/u.test(data.firstname)
        ? ''
        : "Ім'я повинно містити тільки літери та пробіли",
    lastname: !data.lastname.trim()
      ? "Поле обов'язкове"
      : /^[a-zA-Zа-яА-ЯёЁіІїЇєЄ'’\- ]+$/i.test(data.lastname)
        ? ''
        : 'Прізвище повинно містити тільки літери та пробіли',
    surname: !data.surname.trim()
      ? "Поле обов'язкове"
      : /^[a-zA-Zа-яА-ЯёЁіІїЇєЄ'’\- ]+$/i.test(data.surname)
        ? ''
        : 'Поле повинно містити тільки літери та пробіли',
    phone: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(data.phone) ? '' : 'ведіть дійсний номер телефону ',
    email: !data.surname.trim()
      ? "Поле обов'язкове"
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
        ? ''
        : 'ведіть дійсний адрес пошти',
    password: !data.surname.trim()
      ? "Поле обов'язкове"
      : data.password.length < 8
        ? 'Мінімум 8 символів'
        : !/[A-Za-z]/.test(data.password) || !/[0-9]/.test(data.password)
          ? 'Пароль має містити літери та цифри'
          : '',
  })

  const { formData, handleFieldChange, errors } = useFormValidation<IUser>(
    {
      firstname: '',
      lastname: '',
      surname: '',
      phone: '',
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
        navigate('/code-confirmation', {
          state: {
            formData,
            type: CONFIRMATION_TYPES.registerAccount,
          },
        })
      }
      setHasSubmitted(false)
    }
  }, [isError, notificationMessage, hasSubmitted])

  const submitForm = async () => {
    setIsValidated(true)
    await dispatch(registerUser(formData))
    setHasSubmitted(true)
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
        <Typography variant="h5" color="rgba(21, 22, 24, 0.87)">
          Реєстрація
        </Typography>
        <Typography sx={{textAlign:"center",width:"250px", mx:"auto"}} variant="body1" color="rgba(21, 22, 24, 0.6);" gutterBottom>
          Введіть свої дані щоб розпочати роботу
        </Typography>
        <form style={{ width: '100%', marginTop: '16px' }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Ім'я"
              variant="outlined"
              fullWidth
              value={formData.firstname}
              onChange={(event) => handleFieldChange('firstname', event.target.value)}
              error={isValidated && !!errors.firstname}
              helperText={isValidated && errors.firstname}
            />
            <TextField
              label="Прізвище"
              variant="outlined"
              fullWidth
              value={formData.lastname}
              onChange={(event) => handleFieldChange('lastname', event.target.value)}
              error={isValidated && !!errors.lastname}
              helperText={isValidated && errors.lastname}
            />
          </Box>
          <TextField
            sx={{ mb: 2 }}
            label="По батькові"
            variant="outlined"
            fullWidth
            value={formData.surname}
            onChange={(event) => handleFieldChange('surname', event.target.value)}
            error={isValidated && !!errors.surname}
            helperText={isValidated && errors.surname}
          />
          <Box sx={{ mb: 2 }}>
            <PhoneInput
              id="phone-input"
              placeholder="Введіть номер телефону"
              onChange={(value) => handleFieldChange('phone', value ?? '')}
              defaultCountry="UA"
              className={isValidated && errors.phone ? 'PhoneInput error' : 'PhoneInput'}
              maxLength={9}
              // countrySelectComponent={MuiPhoneInput}
            />
          </Box>
          <TextField
            sx={{ mb: 2 }}
            label="Електронна пошта"
            variant="outlined"
            fullWidth
            value={formData?.email}
            onChange={(event) => handleFieldChange('email', event.target.value)}
            error={isValidated && !!errors.email}
            helperText={isValidated && errors.email}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isValidated && errors.email && <ErrorOutlineOutlinedIcon sx={{ color: '#D32F2F' }} />}
                </InputAdornment>
              ),
            }}
          />
          <TextField
            sx={{ mb: 3 }}
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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mb: 2,
              padding: '12px 22px',
              boxShadow:
                '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
              textTransform: 'uppercase',
            }}
            onClick={() => submitForm()}>
            ЗАРЕЄСТРУВАТИСЯ
          </Button>
        </form>
        <Typography variant="body2" align="left" sx={{ mt: 1, color: 'rgba(21, 22, 24, 0.6)' }}>
          Вже маєте акаунт?{' '}
          <Link
            to={getLoginRoute()}
            style={{
              color: '#0029d9',
              textDecoration: 'underline',
              textDecorationColor: '#99a9f0',
              marginLeft: '4px',
            }}>
            Увійти
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
