import {
  Box,
  // Button,
  MenuItem,
  Select,
  // TextField,
  Typography,
  FormControl,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
} from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export function ClubLocationForm() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Accordion
      defaultExpanded={false}
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
        '&.MuiAccordion-root': {
          padding:1
        }
      }}>
      <Box>
          <AccordionSummary
            expandIcon={<ArrowForwardIosIcon />}
            sx={{
              padding: 0,
            }}>
            <Typography variant="h6">s info</Typography>
          </AccordionSummary>
      </Box>
       <form style={{ width: '100%', marginTop: '16px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
              <FormControl fullWidth sx={{ borderRadius: '8px' }}>
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
    </Accordion>
  )
}
