import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import ClinicLogo from '../../../../shared/assets/icons/clinic.svg?react'
import { useEffect } from 'react'

export function ClinicProfileForm({ setSubtitle }: { setSubtitle: (subtitle: string) => void }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    setSubtitle('Профіль клініки')
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: isMobile ? '100%' : 'auto',
        justifyContent: 'space-between',
        boxShadow:
          '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        background: '#fff',
        borderRadius: '16px',
        p: isMobile ? 2 : 3,
        mt: isMobile ? '16px' : '0',
      }}>
      <Box>
        <Typography variant="h6">Лого клініки</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            mt: '8px',
          }}>
          <Box
            sx={{
              border: '1px solid #0029d9',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ClinicLogo color="#0029d9" />
          </Box>
          <Button
            variant="text"
            sx={{
              color: '#0029d9',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '171%',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}>
            змінити
          </Button>
        </Box>
        <form style={{ width: '100%', marginTop: '16px' }}>
          <TextField
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '8px',
              },
            }}
            label="Назва клініки"
            variant="outlined"
            fullWidth
          />
          <Box sx={{ mt: '16px', display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
            <FormControl fullWidth sx={{ borderRadius: '8px' }}>
              <InputLabel id="timezone-label">Часовий пояс</InputLabel>
              <Select
                labelId="timezone-label"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                  width: '100%',
                }}
                label="Часовий пояс">
                <MenuItem value="UTC+2">UTC+2 (Київ)</MenuItem>
                <MenuItem value="UTC+1">UTC+1 (Центральноєвропейський)</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ borderRadius: '8px' }}>
              <InputLabel id="timeformat-label">Формат часу</InputLabel>
              <Select
                labelId="timeformat-label"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    paddingRight: '40px',
                  },
                  width: '100%',
                }}
                label="Формат часу">
                <MenuItem value="24">24-годинний</MenuItem>
                <MenuItem value="12">12-годинний</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ mt: '16px', display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
            <FormControl fullWidth sx={{ borderRadius: '8px' }}>
              <InputLabel id="date-format-label">Формат дати</InputLabel>
              <Select
                labelId="date-format-label"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                  width: '100%',
                }}
                label="Формат дати">
                <MenuItem value="dd.mm.yyyy">ДД.ММ.РР</MenuItem>
                <MenuItem value="mm.dd.yyyy">ММ.ДД.РР</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ borderRadius: '8px' }}>
              <InputLabel id="week-start-label">Початок тижня</InputLabel>
              <Select
                labelId="week-start-label"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    paddingRight: '40px',
                  },
                  width: '100%',
                }}
                label="Початок тижня">
                <MenuItem value="monday">Понеділок</MenuItem>
                <MenuItem value="tuesday">Вівторок</MenuItem>
                <MenuItem value="wednesday">Середа</MenuItem>
                <MenuItem value="thursday">Четвер</MenuItem>
                <MenuItem value="friday">П'ятниця</MenuItem>
                <MenuItem value="saturday">Субота</MenuItem>
                <MenuItem value="sunday">Неділя</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ mt: '16px', display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
            <FormControl fullWidth sx={{ borderRadius: '8px' }}>
              <InputLabel id="use-currencies-label">Використовувати валюти</InputLabel>
              <Select
                labelId="use-currencies-label"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                  width: '100%',
                }}
                label="Використовувати валюти">
                <MenuItem value="uah,usd,eur">UAH, USD, EUR</MenuItem>
                <MenuItem value="uah">UAH</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ borderRadius: '8px' }}>
              <InputLabel id="main-currency-label">Основна валюта</InputLabel>
              <Select
                labelId="main-currency-label"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    paddingRight: '40px',
                  },
                  width: '100%',
                }}
                label="Основна валюта">
                <MenuItem value="uah">UAH</MenuItem>
                <MenuItem value="usd">USD</MenuItem>
                <MenuItem value="eur">EUR</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </form>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          mt: '16px',
        }}>
        <Button
          variant="outlined"
          sx={{
            borderRadius: '8px',
            padding: '12px 22px',
            border: '1px solid #0029d9',
            color: '#0029d9',
            textTransform: 'uppercase',
          }}>
          Скасувати
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: '8px',
            padding: '12px 22px',
            boxShadow:
              '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
            background: '#0029d9',
            textTransform: 'uppercase',
          }}>
          Зберегти зміни
        </Button>
      </Box>
    </Box>
  )
}
