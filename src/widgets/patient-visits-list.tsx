import { Box, Typography, Avatar, Button, IconButton, useMediaQuery, useTheme } from '@mui/material'
import CalendarEditIcon from '../shared/assets/icons/edit-calendar.svg?react'
import BellIcon from '../shared/assets/icons/bell.svg?react'
import NoteIcon from '../shared/assets/icons/note.svg?react'
import AddNoteIcon from '../shared/assets/icons/add-note.svg?react'
import DeleteIcon from '@mui/icons-material/Delete'
import React, { useState } from 'react'
import ReminderModal from './reminder-modal'
import AddNoteDialog from './add-note-dialog'
import ChevronIcon from '../shared/assets/icons/chevron.svg?react'
import { AddEventModal } from '../features/calendar/components/add-event-modal'
import { EditEventModal } from '../features/calendar/components/edit-event-modal'
import type { Event } from '../features/schedule/types/schedule-types'

export interface Visit {
  id: string
  date: Date
  dayOfWeek: string
  time: string
  icon: React.ReactNode
  patientType: string
  room: string
  doctor: { name: string; avatar: string }
  status: string
  statusColor: string
  hasDescription: boolean
  description?: string
}

export interface Reminder {
  id: string
  text: string
  employees: number
  status: string
  statusColor: string
  hasDescription: boolean
  description?: string
}

interface PatientVisitsListProps {
  visits: Visit[]
  reminders: Reminder[]
  searchQuery: string
  onSearchQueryChange: (v: string) => void
}

export const PatientVisitsList: React.FC<PatientVisitsListProps> = ({ visits, reminders }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [reminderModalOpen, setReminderModalOpen] = useState(false)
  const [noteDialogOpen, setNoteDialogOpen] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [createVisitModalOpen, setCreateVisitModalOpen] = useState(false)
  const [editVisitModalOpen, setEditVisitModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const handleAddNote = (visit: Visit) => {
    setSelectedVisit(visit)
    setNoteDialogOpen(true)
  }

  const handleSaveNote = (data: { patient: string; visitDate: Date; event: string; comment: string }) => {
    console.log('Saving note:', data)

    if (selectedVisit) {
      console.log('Updated visit with description:', selectedVisit.id)
    }
  }

  const handleCreateVisit = () => {
    setCreateVisitModalOpen(true)
  }

  const handleEditVisit = (visit: Visit) => {
    const event: Event = {
      id: parseInt(visit.id),
      patientId: 1,
      doctorId: 1,
      roomId: 1,
      date: visit.date.toISOString().split('T')[0],
      start: visit.time,
      end: visit.time,
      status: {
        id: 1,
        value: visit.status,
        color: visit.statusColor,
        order: 1,
      },
      note: visit.description || '',
      type: 'visit',
      characteristic: visit.patientType,
      patient: {
        id: 1,
        name: visit.patientType,
        avatar: '',
        age: 0,
        phone: '',
        important_note: '',
        advance: 0,
      },
      doctor: {
        id: 1,
        name: visit.doctor.name,
        avatar: visit.doctor.avatar || '',
        color: '#000000',
      },
    }
    setSelectedEvent(event)
    setEditVisitModalOpen(true)
  }

  const handleSaveCreateVisit = (newEvent: Omit<Event, 'id'>) => {
    console.log('Creating new visit:', newEvent)
    setCreateVisitModalOpen(false)
  }

  const handleSaveEditVisit = (updatedEvent: Event) => {
    console.log('Updating visit:', updatedEvent)
    setEditVisitModalOpen(false)
  }

  const handleDeleteVisit = (eventId: number) => {
    console.log('Deleting visit:', eventId)
    setEditVisitModalOpen(false)
  }

  return (
    <Box
      sx={{
        m: 2,
        boxShadow:
          '0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
      }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 2, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<BellIcon style={{ width: 18, height: 18, color: '#7324d5' }} />}
          sx={{
            borderColor: '#7324d5',
            color: '#7324d5',
          }}
          onClick={() => setReminderModalOpen(true)}>
          {isMobile ? 'Нагадування' : 'Додати нагадування'}
        </Button>
        <Button variant="contained" onClick={handleCreateVisit}>
          {isMobile ? '+ Візит' : '+ Створити візит'}
        </Button>
      </Box>
      <Box
        sx={{
          overflowX: isMobile ? 'auto' : 'visible',
          width: isMobile ? '100%' : 'auto',
          '& > *': {
            minWidth: isMobile ? '100%' : 'auto',
          },
        }}>
        <Box
          sx={{
            minWidth: isMobile ? '100%' : 'auto',
            width: isMobile ? 'max-content' : 'auto',
          }}>
          <Box sx={{ background: '#e0e5fa', p: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '171%',
                letterSpacing: '0.01em',
                color: 'rgba(21, 22, 24, 0.87)',
              }}>
              Вересень 2024
            </Typography>
          </Box>
          {visits.slice(0, 3).map((visit) => (
            <Box key={visit.id}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: isMobile
                    ? '20px 80px 30px 80px 20px 160px 100px 140px 100px 60px 200px'
                    : '20px 70px 20px 80px 20px 140px 100px 160px 120px 80px 4fr',
                  minWidth: isMobile ? '800px' : 'auto',
                  width: isMobile ? 'max-content' : 'auto',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderBottom: '1px solid rgba(21, 22, 24, 0.12)',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
                onDoubleClick={() => handleEditVisit(visit)}>
                <CalendarEditIcon style={{ width: 20, height: 20, color: '#0029d9' }} />
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: isMobile ? '80px' : '150px',
                    maxWidth: isMobile ? '80px' : '150px',
                    wordWrap: 'break-word',
                  }}>
                  {visit.date.toLocaleDateString('uk-UA')}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    minWidth: isMobile ? '30px' : 'auto',
                    maxWidth: isMobile ? '30px' : 'auto',
                    wordWrap: 'break-word',
                  }}>
                  {visit.dayOfWeek}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: isMobile ? '80px' : 'auto',
                    maxWidth: isMobile ? '80px' : 'auto',
                    wordWrap: 'break-word',
                  }}>
                  {visit.time}
                </Typography>
                {visit.icon}
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: isMobile ? '160px' : 'auto',
                    maxWidth: isMobile ? '160px' : 'auto',
                    wordWrap: 'break-word',
                  }}>
                  {visit.patientType}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: isMobile ? '100px' : 'auto',
                    maxWidth: isMobile ? '100px' : 'auto',
                    wordWrap: 'break-word',
                  }}>
                  {visit.room}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    minWidth: isMobile ? '140px' : 'auto',
                    maxWidth: isMobile ? '140px' : 'auto',
                  }}>
                  <Avatar sx={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: '#ccc', color: 'white' }}>
                    {visit.doctor.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>
                    {visit.doctor.name}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: isMobile ? '100px' : 'auto', maxWidth: isMobile ? '100px' : 'auto' }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: visit.statusColor,
                      color: 'white',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '129%',
                      letterSpacing: '0.01em',
                      padding: '6px 16px',
                      textTransform: 'none',
                      borderRadius: '8px',
                      width: '100%',
                      wordWrap: 'break-word',
                      whiteSpace: 'normal',
                      '&:hover': {
                        backgroundColor: visit.statusColor,
                      },
                    }}>
                    {visit.status}
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    alignItems: 'center',
                    minWidth: isMobile ? '60px' : 'auto',
                    maxWidth: isMobile ? '60px' : 'auto',
                  }}>
                  <IconButton sx={{ p: 0 }}>
                    <DeleteIcon style={{ width: 18, height: 18, color: '#666' }} />
                  </IconButton>
                  {visit.hasDescription ? (
                    <IconButton sx={{ p: 0 }}>
                      <NoteIcon style={{ width: 18, height: 18, color: '#7324d5' }} />
                    </IconButton>
                  ) : (
                    <IconButton sx={{ p: 0 }} onClick={() => handleAddNote(visit)}>
                      <AddNoteIcon style={{ width: 18, height: 18, color: 'rgba(0, 0, 0, 0.3)' }} />
                    </IconButton>
                  )}
                </Box>
                {visit.hasDescription && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      minWidth: isMobile ? '200px' : 'auto',
                      maxWidth: isMobile ? '200px' : 'auto',
                    }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                        {visit.description}
                      </Typography>
                    </Box>
                    <IconButton sx={{ p: 0, flexShrink: 0, mt: 0 }}>
                      <DeleteIcon style={{ width: 18, height: 18, color: '#666' }} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '20px 80px 30px 80px 20px 160px 100px 140px 100px 60px 200px'
                : '30px 1fr 150px 100px 60px 1fr',
              minWidth: isMobile ? '800px' : 'auto',
              width: isMobile ? 'max-content' : 'auto',
              alignItems: 'center',
              gap: 2,
              p: 2,
              backgroundColor: '#fff9f5',
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BellIcon style={{ width: 24, height: 24, color: '#ff9800' }} />
            </Box>
            <Box sx={{ minWidth: isMobile ? '180px' : 'auto', maxWidth: isMobile ? '180px' : 'auto' }}>
              <Typography variant="subtitle2" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                {reminders[1].text}
              </Typography>
            </Box>
            {isMobile && (
              <>
                <Box sx={{ minWidth: '30px', maxWidth: '30px' }}>
                  <Typography
                    sx={{ fontSize: '14px', color: '#666', wordWrap: 'break-word', whiteSpace: 'normal' }}></Typography>
                </Box>
                <Box sx={{ minWidth: '80px', maxWidth: '80px' }}>
                  <Typography
                    sx={{ fontSize: '14px', color: '#666', wordWrap: 'break-word', whiteSpace: 'normal' }}></Typography>
                </Box>
                <Box sx={{ minWidth: '20px', maxWidth: '20px' }}>
                  <Typography
                    sx={{ fontSize: '14px', color: '#666', wordWrap: 'break-word', whiteSpace: 'normal' }}></Typography>
                </Box>
                <Box sx={{ minWidth: '160px', maxWidth: '160px' }}>
                  <Typography
                    sx={{ fontSize: '14px', color: '#666', wordWrap: 'break-word', whiteSpace: 'normal' }}></Typography>
                </Box>
                <Box sx={{ minWidth: '100px', maxWidth: '100px' }}>
                  <Typography
                    sx={{ fontSize: '14px', color: '#666', wordWrap: 'break-word', whiteSpace: 'normal' }}></Typography>
                </Box>
              </>
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minWidth: isMobile ? '140px' : 'auto',
                maxWidth: isMobile ? '140px' : 'auto',
              }}>
              <Typography
                variant="body2"
                sx={{ wordWrap: 'break-word', whiteSpace: 'normal', display: 'flex', alignItems: 'center', gap: 1 }}>
                Співробітників: {reminders[1].employees}
                <ChevronIcon style={{ width: 24, height: 24, fillOpacity: '0.56', transform: 'rotate(90deg)' }} />{' '}
              </Typography>
            </Box>
            <Box sx={{ minWidth: '100px', maxWidth: '100px' }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: reminders[1].statusColor,
                  color: 'white',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '129%',
                  letterSpacing: '0.01em',
                  padding: '6px 16px',
                  textTransform: 'none',
                  borderRadius: '8px',
                  width: '100%',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                  '&:hover': {
                    backgroundColor: reminders[1].statusColor,
                  },
                }}>
                {reminders[1].status}
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', minWidth: '60px', maxWidth: '60px' }}>
              <IconButton sx={{ p: 0 }}>
                <DeleteIcon style={{ width: 18, height: 18, color: '#666' }} />
              </IconButton>
              {reminders[1].hasDescription ? (
                <IconButton sx={{ p: 0 }}>
                  <NoteIcon style={{ width: 18, height: 18, color: '#7324d5' }} />
                </IconButton>
              ) : (
                <IconButton sx={{ p: 0 }}>
                  <AddNoteIcon style={{ width: 18, height: 18, color: '#666' }} />
                </IconButton>
              )}
            </Box>
            {reminders[1].hasDescription && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  minWidth: isMobile ? '200px' : 'auto',
                  maxWidth: isMobile ? '200px' : 'auto',
                }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                    {reminders[1].description}
                  </Typography>
                </Box>
                <IconButton sx={{ p: 0, flexShrink: 0, mt: 0 }}>
                  <DeleteIcon style={{ width: 18, height: 18, color: '#666' }} />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            minWidth: isMobile ? '100%' : 'auto',
            width: isMobile ? 'max-content' : 'auto',
          }}>
          <Box sx={{ background: '#e0e5fa', p: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '171%',
                letterSpacing: '0.01em',
                color: 'rgba(21, 22, 24, 0.87)',
              }}>
              Жовтень 2024
            </Typography>
          </Box>
          {visits.slice(3, 6).map((visit) => (
            <Box key={visit.id}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: isMobile
                    ? '20px 80px 30px 80px 20px 160px 100px 140px 100px 60px 200px'
                    : '20px 70px 20px 80px 20px 140px 100px 160px 120px 80px 4fr',
                  minWidth: isMobile ? '800px' : 'auto',
                  width: isMobile ? 'max-content' : 'auto',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderBottom: '1px solid rgba(21, 22, 24, 0.12)',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
                onDoubleClick={() => handleEditVisit(visit)}>
                <CalendarEditIcon style={{ width: 20, height: 20, color: '#0029d9' }} />
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: isMobile ? '80px' : '150px',
                    maxWidth: isMobile ? '80px' : '150px',
                    wordWrap: 'break-word',
                  }}>
                  {visit.date.toLocaleDateString('uk-UA')}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    minWidth: isMobile ? '30px' : 'auto',
                    maxWidth: isMobile ? '30px' : 'auto',
                    wordWrap: 'break-word',
                  }}>
                  {visit.dayOfWeek}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: isMobile ? '80px' : 'auto',
                    maxWidth: isMobile ? '80px' : 'auto',
                    wordWrap: 'break-word',
                  }}>
                  {visit.time}
                </Typography>
                {visit.icon}
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: isMobile ? '160px' : 'auto',
                    maxWidth: isMobile ? '160px' : 'auto',
                    wordWrap: 'break-word',
                  }}>
                  {visit.patientType}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: isMobile ? '100px' : 'auto',
                    maxWidth: isMobile ? '100px' : 'auto',
                    wordWrap: 'break-word',
                  }}>
                  {visit.room}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    minWidth: isMobile ? '140px' : 'auto',
                    maxWidth: isMobile ? '140px' : 'auto',
                  }}>
                  <Avatar sx={{ width: 32, height: 32, borderRadius: '8px', backgroundColor: '#ccc', color: 'white' }}>
                    {visit.doctor.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>
                    {visit.doctor.name}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: isMobile ? '100px' : 'auto', maxWidth: isMobile ? '100px' : 'auto' }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: visit.statusColor,
                      color: 'white',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '129%',
                      letterSpacing: '0.01em',
                      padding: '6px 16px',
                      textTransform: 'none',
                      borderRadius: '8px',
                      width: '100%',
                      wordWrap: 'break-word',
                      whiteSpace: 'normal',
                      '&:hover': {
                        backgroundColor: visit.statusColor,
                      },
                    }}>
                    {visit.status}
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    alignItems: 'center',
                    minWidth: isMobile ? '60px' : 'auto',
                    maxWidth: isMobile ? '60px' : 'auto',
                  }}>
                  <IconButton sx={{ p: 0 }}>
                    <DeleteIcon style={{ width: 18, height: 18, color: '#666' }} />
                  </IconButton>
                  {visit.hasDescription ? (
                    <IconButton sx={{ p: 0 }}>
                      <NoteIcon style={{ width: 18, height: 18, color: '#7324d5' }} />
                    </IconButton>
                  ) : (
                    <IconButton sx={{ p: 0 }} onClick={() => handleAddNote(visit)}>
                      <AddNoteIcon style={{ width: 18, height: 18, color: 'rgba(0, 0, 0, 0.3)' }} />
                    </IconButton>
                  )}
                </Box>
                {visit.hasDescription && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      minWidth: isMobile ? '200px' : 'auto',
                      maxWidth: isMobile ? '200px' : 'auto',
                    }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                        {visit.description}
                      </Typography>
                    </Box>
                    <IconButton sx={{ p: 0, flexShrink: 0, mt: 0 }}>
                      <DeleteIcon style={{ width: 18, height: 18, color: '#666' }} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '20px 80px 30px 80px 20px 160px 100px 140px 100px 60px 200px'
                : '30px 1fr 150px 100px 60px 1fr',
              minWidth: isMobile ? '800px' : 'auto',
              width: isMobile ? 'max-content' : 'auto',
              alignItems: 'center',
              gap: 2,
              p: 2,
              backgroundColor: '#fff9f5',
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BellIcon style={{ width: 24, height: 24, color: '#ff9800' }} />
            </Box>
            <Box sx={{ minWidth: isMobile ? '180px' : 'auto', maxWidth: isMobile ? '180px' : 'auto' }}>
              <Typography variant="subtitle2" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                {reminders[1].text}
              </Typography>
            </Box>
            {isMobile && (
              <>
                <Box sx={{ minWidth: '30px', maxWidth: '30px' }}>
                  <Typography
                    sx={{ fontSize: '14px', color: '#666', wordWrap: 'break-word', whiteSpace: 'normal' }}></Typography>
                </Box>
                <Box sx={{ minWidth: '80px', maxWidth: '80px' }}>
                  <Typography
                    sx={{ fontSize: '14px', color: '#666', wordWrap: 'break-word', whiteSpace: 'normal' }}></Typography>
                </Box>
                <Box sx={{ minWidth: '20px', maxWidth: '20px' }}>
                  <Typography
                    sx={{ fontSize: '14px', color: '#666', wordWrap: 'break-word', whiteSpace: 'normal' }}></Typography>
                </Box>
                <Box sx={{ minWidth: '160px', maxWidth: '160px' }}>
                  <Typography
                    sx={{ fontSize: '14px', color: '#666', wordWrap: 'break-word', whiteSpace: 'normal' }}></Typography>
                </Box>
                <Box sx={{ minWidth: '100px', maxWidth: '100px' }}>
                  <Typography
                    sx={{ fontSize: '14px', color: '#666', wordWrap: 'break-word', whiteSpace: 'normal' }}></Typography>
                </Box>
              </>
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                minWidth: isMobile ? '140px' : 'auto',
                maxWidth: isMobile ? '140px' : 'auto',
              }}>
              <Typography
                variant="body2"
                sx={{ wordWrap: 'break-word', whiteSpace: 'normal', display: 'flex', alignItems: 'center', gap: 1 }}>
                Співробітників: {reminders[1].employees}
                <ChevronIcon style={{ width: 24, height: 24, fillOpacity: '0.56', transform: 'rotate(90deg)' }} />{' '}
              </Typography>
            </Box>
            <Box sx={{ minWidth: '100px', maxWidth: '100px' }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: reminders[1].statusColor,
                  color: 'white',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '129%',
                  letterSpacing: '0.01em',
                  padding: '6px 16px',
                  textTransform: 'none',
                  borderRadius: '8px',
                  width: '100%',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                  '&:hover': {
                    backgroundColor: reminders[1].statusColor,
                  },
                }}>
                {reminders[1].status}
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', minWidth: '60px', maxWidth: '60px' }}>
              <IconButton sx={{ p: 0 }}>
                <DeleteIcon style={{ width: 18, height: 18, color: '#666' }} />
              </IconButton>
              {reminders[1].hasDescription ? (
                <IconButton sx={{ p: 0 }}>
                  <NoteIcon style={{ width: 18, height: 18, color: '#7324d5' }} />
                </IconButton>
              ) : (
                <IconButton sx={{ p: 0 }}>
                  <AddNoteIcon style={{ width: 18, height: 18, color: '#666' }} />
                </IconButton>
              )}
            </Box>
            {reminders[1].hasDescription && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  minWidth: isMobile ? '200px' : 'auto',
                  maxWidth: isMobile ? '200px' : 'auto',
                }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                    {reminders[1].description}
                  </Typography>
                </Box>
                <IconButton sx={{ p: 0, flexShrink: 0, mt: 0 }}>
                  <DeleteIcon style={{ width: 18, height: 18, color: '#666' }} />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <ReminderModal
        open={reminderModalOpen}
        onClose={() => setReminderModalOpen(false)}
        onSave={(data) => {
          console.log('Reminder data:', data)
          setReminderModalOpen(false)
        }}
      />
      <AddNoteDialog
        open={noteDialogOpen}
        onClose={() => setNoteDialogOpen(false)}
        onSave={handleSaveNote}
        visit={selectedVisit || undefined}
      />
      <AddEventModal
        open={createVisitModalOpen}
        onClose={() => setCreateVisitModalOpen(false)}
        onSave={handleSaveCreateVisit}
      />
      {selectedEvent && (
        <EditEventModal
          open={editVisitModalOpen}
          onClose={() => setEditVisitModalOpen(false)}
          onSave={handleSaveEditVisit}
          onDelete={handleDeleteVisit}
          event={selectedEvent}
        />
      )}
    </Box>
  )
}
