import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { IPricing } from '../../../../app/providers/types/pricing'

interface EditPricingDialogProps {
  open: boolean
  onClose: () => void
  onSave: (pricing: IPricing) => void
  pricing: IPricing | null
}

export function EditPricingDialog({
  open,
  onClose,
  onSave,
  pricing
}: EditPricingDialogProps) {
  const [formData, setFormData] = useState<Partial<IPricing>>({
    name: '',
    description: '',
    is_timed: false,
    start_date: '',
    end_date: '',
    price_segments: [],
    courts: [],
  })

  useEffect(() => {
    if (pricing && open) {
      setFormData({
        ...pricing,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        is_timed: false,
        start_date: '',
        end_date: '',
        price_segments: [],
        courts: [],
      })
    }
  }, [pricing, open])

  const handleChange = (field: keyof IPricing, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    if (formData.name && formData.description) {
      onSave(formData as IPricing)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          minHeight: '400px',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {pricing ? 'Edit Pricing Policy' : 'Create Pricing Policy'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <TextField
            label="Pricing Name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            fullWidth
            required
          />
          
          <TextField
            label="Description"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            fullWidth
            multiline
            rows={3}
            required
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.is_timed || false}
                onChange={(e) => handleChange('is_timed', e.target.checked)}
              />
            }
            label="Time-based pricing"
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={formData.start_date || ''}
              onChange={(e) => handleChange('start_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            
            <TextField
              label="End Date"
              type="date"
              value={formData.end_date || ''}
              onChange={(e) => handleChange('end_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderColor: '#666', 
            color: '#666',
            '&:hover': {
              borderColor: '#333',
              color: '#333',
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          disabled={!formData.name || !formData.description}
          sx={{
            backgroundColor: '#034C53',
            '&:hover': {
              backgroundColor: '#023940',
            },
            '&:disabled': {
              backgroundColor: '#ccc',
            }
          }}
        >
          {pricing ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
