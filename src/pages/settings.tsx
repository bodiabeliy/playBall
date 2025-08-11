import { useCallback, useEffect, useState } from 'react'

import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useMediaQuery,
  useTheme,
  IconButton,
  InputAdornment,
} from '@mui/material'
import PhoneInput from 'react-phone-number-input'
import MuiPhoneInput from '../shared/components/ui/mui-phone-input/mui-phone-input'
import AvatarImage from '../shared/assets/images/avatar.png'
import { SidebarLayout } from '../shared'

import MoreVerticalIcon from '../shared/assets/icons/more-vertical.svg?react'
import BellIcon from '../shared/assets/icons/bell.svg?react'
import { getUser } from '../app/services/UserService'
import { useAppDispatch, useAppSelector } from '../app/providers/store-helpers'
import { userSelector } from '../app/providers/reducers/UserSlice'
import { useFormValidation } from '../shared/hooks/use-form-field'
import type { IProfile, IUser, Language } from '../app/providers/types'
import { systemLanguage } from '../app/constants'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { updateUserProfile, uploadProfileImage } from '../app/services/ProfileService'

export default function SettingsPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(userSelector)

  useEffect(() => {
    dispatch(getUser())
  }, [])

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
      : data?.password?.length < 8
        ? 'Мінімум 8 символів'
        : !/[A-Za-z]/.test(data.password) || !/[0-9]/.test(data.password)
          ? 'Пароль має містити літери та цифри'
          : '',
  })
  const defualtLanguage = systemLanguage.find((lang) => lang.name === 'uk') || systemLanguage[0]
  const { formData, setFormData, handleFieldChange, errors } = useFormValidation<IUser>(
    {
      firstname: '',
      lastname: '',
      surname: '',
      phone: '',
      email: '',
      password: '',
      languge: currentUser?.languge,
    },
    validateSignUp
  )

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        surname: currentUser.surname,
        phone: currentUser.phone,
        email: currentUser.email,
        password: currentUser.password,
        languge: currentUser?.languge,
      })
    }
  }, [currentUser, setFormData])

  const [newPassword, setNewPassword] = useState('')
  const [repeatedPassword, setRepeatedPassword] = useState('')

  // showing password section

  // main password
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // main new pass
  const [showUpdatedPassword, setShowUptatedPassword] = useState(false)
  const handleClickShowUpdatedPassword = () => setShowUptatedPassword((show) => !show)

  const handleMouseDownUpdatedPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleMouseUpUpdatedPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // main new pass
  const [showRepeatedUpdatedPassword, setShowRepeateUptatedPassword] = useState(false)
  const handleClickShowRepeateUpdatedfPassword = () => setShowRepeateUptatedPassword((show) => !show)

  const handleMouseDownRepeateUpdatedPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleMouseUpRepeateUpdatedPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const resetForm = () => {
    setFormData({
      firstname: currentUser?.firstname,
      lastname: currentUser?.lastname,
      surname: currentUser.surname,
      phone: currentUser.phone,
      email: currentUser.email,
      password: currentUser.password,
      languge: currentUser?.languge || defualtLanguage,
    })
    setNewPassword('')
    setRepeatedPassword('')
  }

  // upload file
  const UploadFiles = useCallback((uploadedFile: File) => {
    dispatch(uploadProfileImage(uploadedFile))
  }, [])

  const formSubmit = useCallback(() => {
    const updateProfile: IProfile = {
      first_name: formData?.firstname,
      last_name: formData?.lastname,
      middle_name: formData.surname,
      email: formData.email,
      phone: formData.phone,
      languge: currentUser?.languge,
      photo: '',
      current_password: formData.password,
      new_password: newPassword,
      repeat_password: repeatedPassword,
    }
    dispatch(updateUserProfile(updateProfile))
  }, [currentUser, formData, newPassword, repeatedPassword])

  return (
    <SidebarLayout
      title="Мої налаштування"
      rightSidebar={
        <>
          <IconButton
            sx={{
              background: '#f5f7fe',
              border: '1px solid rgba(0, 41, 217, 0.3)',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
            }}>
            <MoreVerticalIcon style={{ color: '#8a4bdc' }} />
          </IconButton>
          <IconButton
            sx={{
              background: '#8a4bdc',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
            }}>
            <BellIcon style={{ color: 'white' }} />
          </IconButton>
        </>
      }>
      <Box
        sx={{
          maxWidth: 950,
          mx: 'auto',
          mt: isMobile ? 2 : 4,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: isMobile ? 0 : 2,
          p: isMobile ? 2 : 4,
          width: '100%',
        }}>
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
          Фото профілю
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <img src={AvatarImage} style={{ width: 40, height: 40, borderRadius: '8px', marginRight: '12px' }} />
          <Button variant="text" sx={{ color: '#0029d9', fontWeight: 500, textTransform: 'uppercase' }}>
            Змінити
          </Button>
          <TextField
            sx={{ transform: 'translate(-80px)', opacity: 0, maxWidth: '200px' }}
            id="outlined-basic"
            type="file"
            inputProps={{
              multiple: false,
            }}
            onChange={(event) => {
              const file = (event.target as HTMLInputElement).files?.[0]
              if (file) UploadFiles(file)
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            label="Імʼя"
            fullWidth
            value={formData?.firstname}
            onChange={(event) => handleFieldChange('firstname', event.target.value)}
            error={!!errors.firstname}
            helperText={errors.firstname}
          />
          <TextField
            label="Прізвище"
            fullWidth
            value={formData?.lastname}
            onChange={(event) => handleFieldChange('lastname', event.target.value)}
            error={!!errors.lastname}
            helperText={errors.lastname}
          />
        </Box>
        <TextField
          label="По батькові"
          fullWidth
          sx={{ mb: 4 }}
          value={formData?.surname}
          onChange={(event) => handleFieldChange('surname', event.target.value)}
          error={!!errors.surname}
          helperText={errors.surname}
        />
        {!isMobile ? (
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <TextField
              label="Email"
              fullWidth
              value={formData?.email}
              onChange={(event) => handleFieldChange('email', event.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
            <PhoneInput
              id="phone-input"
              placeholder="Введіть номер телефону"
              value={formData?.phone}
              onChange={(value) => handleFieldChange('phone', value || '')}
              maxLength={15}
              countrySelectComponent={MuiPhoneInput}
            />
          </Box>
        ) : (
          <>
            <TextField
              sx={{ mb: 4 }}
              label="Email"
              fullWidth
              value={formData?.email}
              onChange={(event) => handleFieldChange('email', event.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
            <PhoneInput
              id="phone-input"
              placeholder="Введіть номер телефону"
              value={currentUser.phone}
              onChange={(value) => handleFieldChange('phone', value || '')}
              maxLength={15}
              countrySelectComponent={MuiPhoneInput}
            />
          </>
        )}

        <FormControl sx={{ mt: 4 }} fullWidth>
          <InputLabel>Мова інтерфейсу</InputLabel>
          <Select
            value={formData.languge?.name}
            defaultValue={defualtLanguage?.name}
            label="Мова інтерфейсу"
            onChange={() => {
              const { languge } = formData
              handleFieldChange('languge', languge)
            }}>
            {systemLanguage.map((currentLanguage: Language) => (
              <MenuItem key={currentLanguage.name} value={currentLanguage.name} disabled={!currentLanguage.isAvialable}>
                {currentLanguage.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="h6" sx={{ fontWeight: 500, mt: 3, mb: 2 }}>
          Змінити пароль
        </Typography>
        <TextField
          label="Поточний пароль"
          fullWidth
          sx={{ mb: 4 }}
          value={formData.password}
          onChange={(event) => handleFieldChange('password', event.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'hide the password' : 'display the password'}
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpUpdatedPassword}
                  edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Новий пароль"
          fullWidth
          sx={{ mb: 4 }}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          type={showUpdatedPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showUpdatedPassword ? 'hide the password' : 'display the password'}
                  onClick={handleClickShowUpdatedPassword}
                  onMouseDown={handleMouseDownUpdatedPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end">
                  {showUpdatedPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Повторіть пароль"
          fullWidth
          sx={{ mb: 4 }}
          value={repeatedPassword}
          onChange={(event) => setRepeatedPassword(event.target.value)}
          error={newPassword != repeatedPassword}
          helperText={newPassword != repeatedPassword && 'Паролі не співпадають!'}
          type={showRepeatedUpdatedPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showRepeatedUpdatedPassword ? 'hide the password' : 'display the password'}
                  onClick={handleClickShowRepeateUpdatedfPassword}
                  onMouseDown={handleMouseDownRepeateUpdatedPassword}
                  onMouseUp={handleMouseUpRepeateUpdatedPassword}
                  edge="end">
                  {showRepeatedUpdatedPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
          <Button variant="outlined" onClick={() => resetForm()}>
            Скасувати
          </Button>
          <Button variant="contained" onClick={() => formSubmit()} sx={{ bgcolor: '#0029d9' }}>
            Зберегти зміни
          </Button>
        </Box>
      </Box>
    </SidebarLayout>
  )
}
