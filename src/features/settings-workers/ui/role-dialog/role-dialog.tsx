import { Dialog, DialogContent, Box, Typography, TextField, IconButton, Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import TwoLinesIcon from '../../../../shared/assets/icons/two-lines.svg?react'
import WorkerIcon from '../../../../shared/assets/icons/settings/workers.svg?react'
import type { Role } from '../../model'

interface RoleDialogProps {
  open: boolean
  onClose: () => void
  roles: Role[]
  onRolesChange: (roles: Role[]) => void
  onSave: () => void
}

export function RoleDialog({ open, onClose, roles, onRolesChange, onSave }: RoleDialogProps) {
  const handleAddRole = () => {
    onRolesChange([...roles, { value: '' }])
  }

  const handleRemoveRole = (idx: number) => {
    onRolesChange(roles.filter((_, i) => i !== idx))
  }

  const handleRoleChange = (idx: number, val: string) => {
    onRolesChange(roles.map((r, i) => (i === idx ? { value: val } : r)))
  }

  const handleSave = () => {
    onSave()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, background: '#f4f7fe' }}>
        <WorkerIcon style={{ color: '#0029d9', marginRight: 8 }} />
        <Typography variant="h6" sx={{ fontWeight: 500, flex: 1 }}>
          Ролі
        </Typography>
      </Box>
      <DialogContent sx={{ pb: 0 }}>
        {roles.map((role, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TwoLinesIcon style={{ fillOpacity: 0.56, marginRight: 8 }} />
            <TextField
              label="Вкажіть роль"
              value={role.value}
              onChange={(e) => handleRoleChange(idx, e.target.value)}
              fullWidth
              sx={{ background: '#fff', borderRadius: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <IconButton onClick={() => handleRemoveRole(idx)} sx={{ ml: 1 }}>
              <DeleteIcon sx={{ color: '#000', fillOpacity: 0.56 }} />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="outlined"
          fullWidth
          sx={{ borderColor: '#7324d5', color: '#7324d5', mt: 1, mb: 2, textTransform: 'uppercase' }}
          onClick={handleAddRole}>
          + ДОДАТИ РОЛЬ
        </Button>
      </DialogContent>
      <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', px: 3, pb: 3, pt: 1 }}>
        <Button
          variant="outlined"
          sx={{ borderColor: '#0029d9', color: '#0029d9', padding: '12px 22px' }}
          onClick={onClose}>
          СКАСУВАТИ
        </Button>
        <Button variant="contained" sx={{ bgcolor: '#0029d9', padding: '12px 22px', flex: 1 }} onClick={handleSave}>
          ЗБЕРЕГТИ
        </Button>
      </Box>
    </Dialog>
  )
}
