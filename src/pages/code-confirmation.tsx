import { Link, useLocation, useNavigate } from 'react-router'
import type { IUserEmailCode } from '../app/providers/types/index'

import { useAppDispatch, useAppSelector } from '../app/providers/store-helpers'

import { useFormValidation } from '../shared/hooks/use-form-field'

import { Typography, Button, InputAdornment, TextField, Box, useTheme, useMediaQuery } from '@mui/material'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import loginBg from '../shared/assets/images/login-bg.png'
import LogoIcon from '../shared/assets/icons/logo.svg?react'
import { useEffect, useState } from 'react'

import { codeConfirmate, codeRequestConfirmate } from '../app/services/UserService'
import { CONFIRMATION_TYPES } from '../app/services/api/constants'
import { toast, ToastContainer } from 'react-toastify'
import { notificationMessageSelector, isErrorSelector } from '../app/providers/reducers/UserSlice'

export function CodeConfirmationPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isError = useAppSelector(isErrorSelector)
  const errorMessage = useAppSelector(notificationMessageSelector)

  const confirmationEmail = location.state?.formData?.email
  const confirmationType = location.state?.type

  const [confirmationEmail_] = useState(confirmationEmail)
  const [confirmationType_] = useState(confirmationType)

  const validateSignUp = (data: IUserEmailCode) => ({
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data?.email?.trim()) ? '' : 'Будь ласка, введіть дійсні дані',
    code: data?.code?.trim() ? '' : "Поле обов'язкове",
  })

  const { formData, handleFieldChange, errors } = useFormValidation<IUserEmailCode>(
    {
      email: confirmationEmail_,
      code: '',
    },
    validateSignUp
  )

  const [isValidated, setIsValidated] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  useEffect(() => {
    if (hasSubmitted) {
      if (isError) {
        console.log('error', errorMessage)
      } else {
        if (confirmationType_ == CONFIRMATION_TYPES.resetPassword) {
          navigate('/recovery-password', { state: { confirmationEmail_, formData } })
        }
        if (confirmationType_ == CONFIRMATION_TYPES.registerAccount) {
          navigate('/', { state: { confirmationEmail_, formData } })
        }
      }
      setHasSubmitted(false)
    }
  }, [isError, errorMessage, hasSubmitted])

  const sendConfirmationRequest = async () => {
    await toast.success(errorMessage)
    await dispatch(codeRequestConfirmate(confirmationEmail_, confirmationType_))
  }

  const submitForm = async () => {
    setIsValidated(true)
    await dispatch(codeConfirmate(confirmationEmail_, formData?.code))
    if (confirmationType_ === CONFIRMATION_TYPES.resetPassword) {
      navigate('/recovery-password', { state: { confirmationEmail_, formData } })
    } else if (confirmationType_ === CONFIRMATION_TYPES.registerAccount) {
      navigate('/', { state: { confirmationEmail_, formData } })
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
        <Typography sx={{textAlign:"center", width:"315px", mx:"auto"}} variant="body1" color="rgba(21, 22, 24, 0.6);" gutterBottom>
         We’ve sent a password reset link to your email. Please check your inbox and follow the instructions to create a new password
        </Typography>
        <form style={{ width: '100%', marginTop: '16px' }}>
          <TextField
            sx={{ mb: 2 }}
            // label="Введіть код"
            placeholder='Enter code'
            variant="outlined"
            fullWidth
            value={formData.code}
            onChange={(event) => handleFieldChange('code', event.target.value)}
            error={isValidated && !!errors.code}
            helperText={isValidated && errors.code}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isValidated && errors.code ? <ErrorOutlineOutlinedIcon sx={{ color: '#D32F2F' }} /> : ''}
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
              mt: 4,
              bgcolor:"#034C53",
              padding: '12px 22px',
              boxShadow:
                '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
              textTransform: 'uppercase',
            }}
            onClick={() => submitForm()}>
            Okay
          </Button>
         <Box sx={{display:"flex", justifyContent:"center"}}>
           <Typography variant="body1">
           No email?
          </Typography>
            <Link
            to={'/code-confirmation'}
            onClick={() => sendConfirmationRequest()}
            style={{
              color: '#034C53',
              textDecoration: 'underline',
              textDecorationColor: '#034C53',
              marginLeft: '4px',
            }}>
             Click here to resend?
          </Link>
         </Box>
        </form>
        {/* <Typography variant="body2" align="left" sx={{ mt: 1, color: 'rgba(21, 22, 24, 0.6)' }}>
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
        </Typography> */}
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
