import { Dialog, DialogContent, Box, Typography, TextField, Button } from '@mui/material'
import WorkerIcon from '../../../../shared/assets/icons/settings/workers.svg?react'

interface AddBranchDialogProps {
  open: boolean
  onClose: () => void
  onSave: () => void
}

export function AddBranchDialog({ open, onClose, onSave }: AddBranchDialogProps) {
  const handleSave = () => {
    onSave()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, background: '#f4f7fe' }}>
        <WorkerIcon style={{ color: '#0029d9', marginRight: 8 }} />
        <Typography variant="h6" sx={{ fontWeight: 500, flex: 1 }}>
          Додати філію
        </Typography>
      </Box>
      <DialogContent sx={{ pb: 0 }}>
        <TextField label="Вкажіть назву філії" fullWidth sx={{ background: '#fff', borderRadius: 2, mt: 2 }} />
        <TextField label="Вкажіть адресу філії" fullWidth sx={{ background: '#fff', borderRadius: 2, my: 2 }} />
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
