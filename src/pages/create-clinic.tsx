import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Typography,
  useTheme,
  TextField,
  DialogActions,
  IconButton,
} from '@mui/material'
import RocketIcon from '../shared/assets/icons/rocket.svg?react'
import LetterIcon from '../shared/assets/icons/letter.svg?react'
import CardBg from '../shared/assets/images/home_card_bg.png'
import { useMediaQuery } from '@mui/material'
import FileUpload from '../features/file-upload'
import { useState } from 'react'
import { SidebarLayout } from '../shared'
import MoreVerticalIcon from '../shared/assets/icons/more-vertical.svg?react'
import BellIcon from '../shared/assets/icons/bell.svg?react'

export function CreateClubPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [isCreateClinicDialogOpen, setIsCreateClinicDialogOpen] = useState(false)
  return (
    <SidebarLayout
      title="Створення клініки"
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
          p: isMobile ? 2 : 4,
          flex: 1,
        }}>
        <Box>
          <Typography variant={isMobile ? 'h5' : 'h4'}>
            Вітаємо у системі, <span style={{ color: '#0029d9' }}> Олександре!</span>
          </Typography>
          <Typography variant="body1">Розпочніть роботу з управління клінікою просто та зручно!</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            mt: isMobile ? 2 : 10,
            p: isMobile ? 0 : 4,
            alignItems: 'stretch',
            flexDirection: { xs: 'column', lg: 'row' },
          }}>
          <Box
            sx={{
              minHeight: isMobile ? 'auto' : '400px',
            }}>
            <Typography
              variant={isMobile ? 'subtitle1' : 'h6'}
              sx={{
                color: 'rgba(0, 41, 217, 1)',
              }}>
              Створіть клініку та налаштуйте її роботу
            </Typography>
            <Box
              sx={{
                boxShadow:
                  '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                background: 'linear-gradient(153deg, rgba(121, 134, 203, 0) 0%, #7986cb 100%), #2c334a',
                borderRadius: 2,
                p: isMobile ? 2 : 4,
                mt: '16px',
                color: '#fff',
                minHeight: isMobile ? 'auto' : '400px',
                textAlign: isMobile ? 'center' : 'left',
              }}>
              <RocketIcon
                style={{
                  margin: '0 auto',
                  display: 'block',
                  width: isMobile ? '44px' : '52px',
                  height: isMobile ? '44px' : '52px',
                }}
              />
              <Typography sx={{ mt: '24px' }} variant={isMobile ? 'subtitle1' : 'h6'} color="inherit">
                Запустіть ефективну систему управління клінікою вже сьогодні
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                }}
                variant={isMobile ? 'body2' : 'subtitle1'}
                color="inherit">
                Легко створіть клініку та налаштуйте всі важливі аспекти її роботи: від записів пацієнтів до управління
                фінансами
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mx: 'auto',
                  display: 'block',
                  mt: '24px',
                  boxShadow:
                    '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
                  background: '#7324d5',
                  borderRadius: '8px',
                  padding: isMobile ? '6px 16px' : '12px 24px',
                }}
                onClick={() => setIsCreateClinicDialogOpen(true)}>
                Створити клініку
              </Button>
            </Box>
          </Box>
          <Box>
            <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={{ color: 'rgba(0, 41, 217, 1)' }}>
              Очікуєте на запрошення?
            </Typography>
            <Box
              sx={{
                background: `url(${CardBg})`,
                backgroundPosition: '-25px -15px',
                backgroundSize: '110% 110%',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#fff',
                borderRadius: '8px',
                mt: '16px',
                p: isMobile ? 2 : 4,
                pt: 4,
                boxShadow:
                  '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                minHeight: isMobile ? 'auto' : '400px',
                textAlign: isMobile ? 'center' : 'left',
              }}>
              <LetterIcon
                style={{
                  margin: '0 auto',
                  display: 'block',
                  width: isMobile ? '44px' : '52px',
                  height: isMobile ? '44px' : '52px',
                  fillOpacity: '0.56',
                }}
              />
              <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={{ mt: '36px' }}>
                Запрошення ще не надійшло
              </Typography>
              <Typography variant={isMobile ? 'body2' : 'subtitle1'} sx={{ mt: isMobile ? '12px' : '56px' }}>
                Як тільки ваше запрошення буде надіслано, воно з'явиться тут, і ви зможете приєднатися до клініки та
                продовжити роботу
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Dialog
        open={isCreateClinicDialogOpen}
        onClose={() => setIsCreateClinicDialogOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: isMobile ? '100%' : 700,
            borderRadius: isMobile ? 0 : 2,
            m: 2,
            p: 0,
            background: '#fff',
            boxShadow: '0 4px 24px rgba(44,51,74,0.12)',
            display: 'flex',
            overflow: 'visible',
          },
        }}>
        <DialogTitle>
          <Typography variant="h5">Створення клініки</Typography>
        </DialogTitle>
        <DialogContent>
          <FormControl sx={{ width: '100%' }}>
            <TextField
              label="Вкажіть назву"
              fullWidth
              sx={{
                mt: 2,
              }}
              placeholder="Вкажіть назву"
            />
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <TextField
              label="Вкажіть назву філії"
              fullWidth
              sx={{
                mt: 2,
              }}
              placeholder="Вкажіть назву філії"
            />
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Додайте логотип</Typography>
            <FileUpload />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              borderRadius: '8px',
              padding: '12px 22px',
              boxShadow:
                '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
            }}>
            Створити
          </Button>
        </DialogActions>
      </Dialog>
    </SidebarLayout>
  )
}
