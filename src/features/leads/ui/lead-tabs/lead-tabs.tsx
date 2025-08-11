import {
  Box,
  Typography,
  TextField,
  IconButton,
  Chip,
  Avatar,
  Divider,
  Checkbox,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TelegramIcon from '@mui/icons-material/Telegram'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

import CallSuccessStatusIcon from '../../../../shared/assets/icons/call-status.svg?react'
import { STATUS_COLORS } from '../../model/constants'
import { useTranslation } from 'react-i18next'

// migrate to constants in the future
const MockCallTable = [
  {
    id: 1,
    caller: 'Ніна Нічненко',
    date: '21.23.2024',
    time: '15:30',
    recording: 'Запис дзвінка 1',
    status: 'Принято',
    colorStatus: '#2E7D32',
    lineCode: 145,
    waitTime: '00:45',
    duration: '01:30',
  },
  {
    id: 2,
    caller: 'Олег Тарасенко',
    date: '21.23.2024',
    time: '16:00',
    recording: 'Запис дзвінка 2',
    status: 'Зайнято',
    colorStatus: '#FFB300',
    lineCode: 165,
    waitTime: '01:45',
    duration: '01:50',
  },
  {
    id: 2,
    caller: 'Микита Карасенко',
    date: '21.03.2025',
    time: '17:00',
    recording: 'Запис дзвінка 2',
    status: 'Відхілено',
    colorStatus: '#D32F2F',
    lineCode: 115,
    waitTime: '00:10',
    duration: '01:04',
  },
]

const MockCallList = [
  {
    id: 1,
    authour: 'Автор ПІБ',
    date: '21.23.2024',
    text: 'В шановного пацієнта, під час  огляду було виявлено покращення загального стану здоров’я. виявлено покращення загального стану здоров’я.',
  },
  {
    id: 2,
    authour: 'Автор ПІБ',
    date: '21.23.2024',
    text: 'В шановного пацієнта, під час  огляду ',
  },
  {
    id: 3,
    authour: 'Автор ПІБ',
    date: '21.23.2024',
    text: 'В шановного пацієнта, під час  огляду ',
  },
  {
    id: 4,
    authour: 'Автор ПІБ',
    date: '21.23.2024',
    text: 'В шановного пацієнта, під час  огляду ',
  },
  {
    id: 5,
    authour: 'Автор ПІБ',
    date: '21.23.2024',
    text: 'В шановного пацієнта, під час  огляду ',
  },
  {
    id: 6,
    authour: 'Автор ПІБ',
    date: '21.23.2024',
    text: 'В шановного пацієнта, під час  огляду ',
  },
  {
    id: 7,
    authour: 'Автор ПІБ',
    date: '21.23.2024',
    text: 'В шановного пацієнта, під час  огляду ',
  },
]

interface LeadTabsProps {
  activeTab: number
  tabIndex: number
  isMobile?: boolean
  taskOnClick?: () => void
}

export function LeadTabs({ activeTab, isMobile, taskOnClick }: LeadTabsProps) {
  const { t } = useTranslation('customers')

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        width: '100%',
        transform: isMobile && activeTab == 0 ? 'translateY(-30px)' : 'translateY(0px)',
      }}>
      {/* Left column */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          display: activeTab === 0 || activeTab === 1 ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 2,
        }}>
        {/* Note input */}
        <Paper
          sx={{
            borderRadius: 3,
            m: isMobile ? 1 : 0,
            boxShadow:
              '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}>
          <TextField
            multiline
            minRows={2}
            maxRows={6}
            fullWidth
            placeholder="Текст нотатки"
            variant="outlined"
            value=""
            sx={{
              borderRadius: 2,
              color: 'grey',
              input: { color: 'grey' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
            }}
          />
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <IconButton size="small">
              <FormatBoldIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <FormatItalicIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <FormatUnderlinedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <AttachFileIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <EmojiEmotionsIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <TelegramIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
        <Box sx={{ p: isMobile ? 1 : 0 }}>
          <Paper sx={{ borderRadius: 3 }}>
            <Box
              sx={{
                maxHeight: !isMobile ? 370 : 'auto',
                overflowY: 'auto',
                bgcolor: 'rgba(0, 41, 217, 0.04)',
                border: 1,
                borderColor: 'rgba(0, 41, 217, 0.1)',
                borderRadius: 2,
              }}>
              {MockCallList.map((note) => (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 2,
                      p: 1,
                    }}
                    key={note.id}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                        <Typography variant="body2" fontWeight={500}>
                          {note.authour}
                        </Typography>
                        <Typography variant="caption" sx={{ ml: 1, mr: 3 }}>
                          {note.date}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">{note.text}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Divider />
                </>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Tasks */}
      </Box>

      {/* Right column */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          display: activeTab === 0 || activeTab === 2 ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 2,
        }}>
        {/* Calls */}
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            width: '100%',
            boxShadow:
              '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, color: '#15161899' }}>
            <Typography variant="subtitle1" fontWeight={500}>
              {t('leadInfoShortTableTitle')}
            </Typography>

            <Typography variant="body2">{t('leadInfoShortTableTActivity')}</Typography>
          </Box>
          <Table
            sx={{
              width: '100%',
              minWidth: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              tableLayout: 'auto',
            }}>
            <TableHead>
              <TableRow sx={{ background: '#f8f9fb' }}>
                {activeTab === 0 && (
                  <>
                    <TableCell sx={{ width: 8, p: 0, background: '#f8f9fb' }} />
                    <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none', minWidth: 100, width: 220 }}>
                      ПІБ
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none', width: 60 }}>
                      дата і час
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none', width: 60 }}>запис</TableCell>
                  </>
                )}
                {activeTab === 2 && (
                  <>
                    <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none', width: 60 }}></TableCell>
                    <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none', width: 60 }}>Лінія</TableCell>
                    <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none', width: 60 }}>
                      Хто дзвонив
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none', width: 60 }}>
                      Статус
                    </TableCell>

                    <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none', width: 60 }}>
                      Очікування
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, background: '#f8f9fb', border: 'none', width: 60 }}>
                      Тривалість
                    </TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {MockCallTable.map((call, idx) => (
                <TableRow
                  sx={{
                    background: idx % 2 === 0 ? '#fff' : '#f8f9fb',
                    '&:last-child td, &:last-child th': { border: 0 },
                    border: 'none',
                    boxShadow: 'none',
                    minHeight: 77,
                  }}>
                  {activeTab === 0 && (
                    <>
                      <TableCell
                        sx={{
                          p: 0,
                          width: 8,
                          background: 'transparent',
                          border: 'none',
                          height: '100%',
                          minHeight: 77,
                        }}>
                        <Box
                          sx={{
                            width: 4,
                            height: '100%',
                            minHeight: 77,
                            borderRadius: '2px',
                            background: call.colorStatus,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          border: 'none',
                          fontSize: 16,
                          minWidth: 150,
                        }}>
                        {call.caller}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 14,
                          border: 'none',
                          minWidth: 120,
                          py: 2,
                          color: '#718096',
                        }}>
                        {call.date} {call.time}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 14,
                          border: 'none',
                          py: 2,
                        }}>
                        <IconButton
                          size="small"
                          sx={{
                            borderRadius: '8px',
                            bgcolor: '#0029D9',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 41, 217, 0.04)',
                            },
                          }}>
                          <PlayArrowIcon />
                        </IconButton>
                      </TableCell>
                    </>
                  )}
                  {activeTab === 2 && (
                    <>
                      <TableCell sx={{ fontSize: 14, border: 'none' }}>
                        <CallSuccessStatusIcon />
                      </TableCell>

                      <TableCell sx={{ fontSize: 14, border: 'none' }}>{call.lineCode}</TableCell>
                      <TableCell sx={{ fontSize: 14, border: 'none', minWidth: isMobile ? 300 : 'auto' }}>
                        {call.caller}
                      </TableCell>

                      <TableCell sx={{ fontSize: 14, border: 'none' }}>
                        <Chip
                          label={call.status}
                          sx={{
                            backgroundColor:
                              call.status === 'Принято'
                                ? STATUS_COLORS.success
                                : call.status === 'Зайнято'
                                  ? STATUS_COLORS.pending
                                  : STATUS_COLORS.error,
                            color: 'white',
                            fontSize: '14px',
                            height: '32px',
                            borderRadius: '8px',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 14, border: 'none' }}>{call.waitTime}</TableCell>
                      <TableCell sx={{ fontSize: 14, border: 'none' }}>{call.duration}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* Last chat message */}
        <Paper
          sx={{
            p: 2,
            display: activeTab === 0 ? 'block' : 'none',
            border: '1px solid rgba(197, 199, 252, 1)',
            borderRadius: 3,
            boxShadow:
              '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            bgcolor: 'rgba(0, 41, 217, 0.04)',
          }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, color: '#15161899' }}>
            <Typography variant="body2" fontWeight={500} mb={1}>
              {t('leadInfoLastMassage')}
            </Typography>
            <Typography sx={{ alignSelf: 'stretch' }} variant="body2">
              {t('leadInfoLastMassageActivity', { count: 1 })}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: 2,
              p: 1,
              background: 'rgba(0, 41, 217, 0.08)',
              width: '100%',
              position: 'relative',
              border: '1px solid #ff9800',
            }}>
            <Avatar src="" sx={{ width: 40, height: 40, fontSize: 28, borderRadius: '12px' }} />
            <Box sx={{ flex: 1, ml: 2 }}>
              <Typography variant="body2" fontWeight={500}>
                Марія Іванівна
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                <TelegramIcon
                  fontSize="small"
                  sx={{ position: 'absolute', left: 25, color: 'white', bgcolor: '#3b8beb', borderRadius: '50%' }}
                />
                <Typography variant="body2">Текст надісланого повідомлення</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', ml: 1 }}>
              <Typography variant="caption" sx={{ ml: 1 }}>
                10:15
              </Typography>
              <Box>
                <span role="img" aria-label="globe" style={{ fontSize: 16, marginLeft: 4 }}>
                  🌐
                </span>
                <Chip label="2" size="small" sx={{ bgcolor: '#ff9800', color: '#fff', fontWeight: 500, ml: 1 }} />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Bottom column */}
      <Box
        sx={{
          flex: 1,
          minWidth: 340,
          maxWidth: '100%',
          display: activeTab === 0 || activeTab === 2 || activeTab === 3 ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 2,
        }}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            width: '100%',
            opacity: activeTab === 2 ? '0' : '1',
            boxShadow:
              '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, color: '#15161899' }}>
            <Typography variant="subtitle1" fontWeight={500}>
              {t('leadInfoTasksTitle')}
              <IconButton size="small" color="primary" onClick={taskOnClick}>
                <AddIcon />
              </IconButton>
            </Typography>

            <Typography variant="body2">{t('leadInfoTasksTitleActivity')}</Typography>
          </Box>
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
                color: '#15161899',
              }}>
              <Box>
                <Typography sx={{ color: '#718096', fontSize: 14, mb: 0.5 }}>Відповідальний:</Typography>
                <Typography>Всі адміністратори</Typography>
              </Box>

              <Typography variant="body2">23.20.2024</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Checkbox />
              <Typography variant="body2">
                В шановного пацієнта, під час огляду було виявлено покращення загального стану здоров’я. виявлено
                покращення загального стану здоров’я.
              </Typography>
              <Chip
                label="В роботі"
                size="small"
                sx={{
                  alignSelf: 'center',
                  bgcolor: '#2e7d32',
                  color: '#fff',
                  fontSize: '14px',
                  height: '32px',
                  borderRadius: '8px',
                  fontWeight: 500,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 0.5 }}>
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                Завершення: 23.20.2024 10:30
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
                color: '#15161899',
              }}>
              <Box>
                <Typography sx={{ color: '#718096', fontSize: 14, mb: 0.5 }}>Відповідальний:</Typography>
                <Typography>Марія Бех</Typography>
              </Box>

              <Typography variant="body2">23.20.2024</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Checkbox />
              <Typography variant="body2">
                В шановного пацієнта, під час огляду було виявлено покращення загального стану здоров’я. виявлено
                покращення загального стану здоров’я.
              </Typography>
              <Chip
                label="В роботі"
                size="small"
                sx={{
                  alignSelf: 'center',
                  bgcolor: '#2e7d32',
                  color: '#fff',
                  fontSize: '14px',
                  height: '32px',
                  borderRadius: '8px',
                  fontWeight: 500,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 0.5 }}>
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                Завершення: 23.20.2024 10:30
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
