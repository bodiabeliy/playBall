import { useState } from 'react'
import { Box, Button, TextField, MenuItem, Select, Typography, FormControl, InputLabel } from '@mui/material'
import type { Worker, WorkerFormData } from '../../model'
import { ROLE_OPTIONS, BRANCH_OPTIONS, COLOR_OPTIONS } from '../../model'
import ColorIcon from '../../../../shared/assets/icons/status.svg?react'

interface EditWorkerFormProps {
  worker?: Worker
  onCancel: () => void
  onSave: (data: WorkerFormData) => void
}

export function EditWorkerForm({ worker, onCancel }: EditWorkerFormProps) {
  const [firstName] = useState(worker?.name.split(' ')[0] || '')
  const [lastName] = useState(worker?.name.split(' ')[1] || '')
  const [middleName] = useState(worker?.name.split(' ')[2] || '')
  const [email] = useState(worker?.email)
  const [phone] = useState('+380(11)111-11-11')
  const [role, setRole] = useState(worker?.role)
  const [branch, setBranch] = useState(worker?.branch)
  const [rate1, setRate1] = useState('1')
  const [rate2, setRate2] = useState('2')
  const [color, setColor] = useState(worker?.color)

  const handleSave = () => {
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        pt: 0,
        background: '#fff',
      }}>
      <Box sx={{ flexGrow: 1, minHeight: 0, overflow: 'auto' }}>
        <Typography fontWeight={600} fontSize={20}>
          Фото профілю
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            style={{ borderRadius: 8, width: 40, height: 40 }}
          />
          <Button sx={{ p: 0, minWidth: 0, ml: 1, color: '#0029d9' }} variant="text">
            ЗМІНИТИ
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, my: 4 }}>
          <TextField label="Ім'я" value={firstName} fullWidth disabled />
          <TextField label="Прізвище" value={lastName} disabled fullWidth />
        </Box>
        <TextField label="По батькові" value={middleName} disabled fullWidth sx={{ mb: 4 }} />
        <TextField label="Email" value={email} disabled fullWidth sx={{ mb: 4 }} />
        <TextField label="Номер телефону" value={phone} disabled fullWidth sx={{ mb: 4 }} />
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="role-label">Роль</InputLabel>
            <Select labelId="role-label" label="Роль" value={role} onChange={(e) => setRole(e.target.value as string)}>
              {ROLE_OPTIONS.map((roleOption) => (
                <MenuItem key={roleOption} value={roleOption}>
                  {roleOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="branch-label">Філія</InputLabel>
            <Select
              labelId="branch-label"
              label="Філія"
              value={branch}
              onChange={(e) => setBranch(e.target.value as string)}>
              {BRANCH_OPTIONS.map((branchOption) => (
                <MenuItem key={branchOption} value={branchOption}>
                  {branchOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField label="Погодинна ставка 1" value={rate1} onChange={(e) => setRate1(e.target.value)} fullWidth />
          <TextField label="Погодинна ставка 2" value={rate2} onChange={(e) => setRate2(e.target.value)} fullWidth />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography fontSize={14} mb={1}>
            Колір користувача
          </Typography>
          <Select
            value={color}
            onChange={(e) => setColor(e.target.value as string)}
            fullWidth
            sx={{
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              },
            }}>
            {COLOR_OPTIONS.map((colorOption) => (
              <MenuItem
                key={colorOption.value}
                value={colorOption.value}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ColorIcon style={{ color: colorOption.value }} />
                {colorOption.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          mt: 2,
        }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            borderRadius: '8px',
            padding: '6px 16px',
            border: '1px solid #0029d9',
            color: '#0029d9',
            textTransform: 'uppercase',
          }}>
          Скасувати
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            borderRadius: '8px',
            padding: '6px 16px',
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
