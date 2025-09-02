import { Dialog, DialogContent, Button, Box, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers'
import { clubSelector } from '../../../../app/providers/reducers/ClubSlice'
import { useCallback } from 'react'
import type { ICourt } from '../../../../app/providers/types/court'
import { deleteCourt } from '../../../../app/services/CourtService'
import CloseIcon from '../../../../shared/assets/icons/close.svg?react'

interface RemoveCourtDialogProps {
  open: boolean
  onClose: () => void
  onDelete: () => void
  court: ICourt | null
}

export function RemoveCourtDialog({ open, onClose, onDelete, court }: RemoveCourtDialogProps) {
  const dispatch = useAppDispatch()
  const currentClub = useAppSelector(clubSelector)

  const handleDelete = useCallback(async () => {
    if (court?.id && currentClub?.id) {
      try {
        // Call API to delete the court
        await dispatch(deleteCourt(currentClub.id, court.id))
        onDelete() // Notify parent component about successful deletion
        onClose()  // Close the dialog
      } catch (error) {
        console.error('Failed to delete court:', error)
      }
    }
  }, [court, currentClub, dispatch, onDelete, onClose])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          width: '360px',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: '8px',
        right: '8px'
      }}>
        <Button
          onClick={onClose}
          sx={{
            minWidth: '32px',
            width: '32px',
            height: '32px',
            p: 0,
            color: '#888',
            '&:hover': {
              background: 'transparent',
              color: '#000'
            }
          }}
        >
          <CloseIcon  />
        </Button>
      </Box>
      
      <DialogContent sx={{
        px: 3,
        py: 2.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <Typography variant="h6" sx={{
          fontWeight: 600,
          fontSize: '20px',
          color: '#1a1a1a',
          mb: 1.5
        }}>
          Delete Court?
        </Typography>
        
        <Typography variant="body2" sx={{
          color: '#666',
          mb: 3,
          maxWidth: '320px',
          mx: 'auto',
          fontSize: '15px'
        }}>
          Are you sure you want to delete this court?
          This action cannot be undone.
        </Typography>
        
        <Box sx={{
          display: 'flex',
          width: '100%',
          gap: '10px',
          justifyContent: 'center'
        }}>
          <Button
            variant="text"
            fullWidth
            sx={{
              color: '#444',
              padding: '10px',
              height: '48px',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              backgroundColor: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#e8e8e8',
              }
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
          
          <Button
            variant="contained"
            disableElevation
            fullWidth
            sx={{
              backgroundColor: '#e74c3c',
              padding: '10px',
              height: '48px',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#d44333',
                boxShadow: 'none',
              }
            }}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
