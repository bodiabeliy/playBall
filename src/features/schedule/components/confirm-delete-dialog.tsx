import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import TrashIcon from '../../../shared/assets/icons/trash.svg?react'

interface ConfirmDeleteDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  warning?: string
  cancelText?: string
  confirmText?: string
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Видалити',
  description = 'Ви впевнені, що хочете видалити?',
  warning = 'Цю дію не можна буде скасувати.',
  cancelText = 'Скасувати',
  confirmText = 'Видалити',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0,
          background: '#fff',
          boxShadow: '0 4px 24px rgba(44,51,74,0.12)',
          maxWidth: 500,
          width: '100%',
        },
      }}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: '#f6f8ff',
          fontWeight: 600,
          fontSize: 20,
          pb: 1,
        }}>
        <TrashIcon style={{ color: '#d32f2f', marginRight: 8, width: 24, height: 24 }} />
        {title}
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 500, textAlign: 'center', pt: 2 }}>
          {description}
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          {warning}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2, pt: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            minWidth: 140,
            borderRadius: '8px',
            fontWeight: 600,
            bgcolor: '#fff',
            '&:hover': { bgcolor: '#f7f7fa', borderColor: '#1976d2' },
          }}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            minWidth: 140,
            borderRadius: '8px',
            fontWeight: 600,
            bgcolor: '#0d33d9',
            color: '#fff',
            '&:hover': { bgcolor: '#0029b9' },
          }}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
