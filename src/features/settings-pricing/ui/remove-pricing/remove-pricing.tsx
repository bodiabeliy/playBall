import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { IPricing } from '../../../../app/providers/types/pricing'

interface RemovePricingDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  pricing: IPricing | null
}

export function RemovePricingDialog({
  open,
  onClose,
  onConfirm,
  pricing
}: RemovePricingDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          p: 2,
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <DialogContent sx={{ textAlign: 'center', pt: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Delete Price?
        </Typography>
        
        <Typography variant="body1" sx={{ color: '#666', mb: 1 }}>
          Are you sure you want to delete this price?
        </Typography>
        
        <Typography variant="body2" sx={{ color: '#888' }}>
          This action cannot be undone and may affect existing reservations
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderColor: '#DFDFDF',
            backgroundColor: '#DFDFDF',
            color: '#000',
            borderRadius: '8px',
            px: 4,
            '&:hover': {
              borderColor: '#ccc',
              backgroundColor: '#ccc',
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: '#dc3545',
            borderRadius: '8px',
            px: 4,
            '&:hover': {
              backgroundColor: '#c82333',
            }
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
