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

  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { IPricing } from '../../../../app/providers/types/pricing'
import { clubSelector } from '../../../../app/providers/reducers/ClubSlice'
import { courtsSelector } from '../../../../app/providers/reducers/CourtSlice'
import { useAppSelector, useAppDispatch } from '../../../../app/providers/store-helpers'
import { getAllCourts } from '../../../../app/services/CourtService'

interface EditPricingDialogProps {
  open: boolean
  onClose: () => void
  onSave: (pricing: IPricing) => void
  pricing: IPricing | null
}

export function PricingDialog({
  open,
  onClose,
  onSave,
  pricing,
}: EditPricingDialogProps) {
  const [formData, setFormData] = useState<IPricing>({
    name: '',
    description: '',
    is_timed: false,
    start_date: '',
    end_date: '',
    price_segments: [],
    court_ids: [],
    courts: [],
  })

  const dispatch = useAppDispatch()
  const currentClub = useAppSelector(clubSelector)
  const courtsList = useAppSelector(courtsSelector)

  // Fetch courts for current club when dialog opens
  useEffect(() => {
    if (open && currentClub?.id) {
      dispatch(getAllCourts(currentClub.id))
    }
  }, [open, currentClub?.id, dispatch])


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
        court_ids:[],
        courts: [],
      })
    }
  }, [pricing, open])

  const handleChange = (field: keyof IPricing, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
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

          {/* Courts multi-select, uses court_ids per API schema */}
          <FormControl fullWidth>
            <InputLabel id="pricing-courts-label">Courts</InputLabel>
            <Select
              labelId="pricing-courts-label"
              multiple
              value={(formData.court_ids || []) as string[]}
              onChange={(e) => handleChange('court_ids', typeof e.target.value === 'string' ? [e.target.value] : (e.target.value as string[]))}
              input={<OutlinedInput label="Courts" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((id) => {
                    const court = courtsList?.items?.find(c => String(c.id) === String(id))
                    return <Chip key={id} label={court?.name || id} size="small" />
                  })}
                </Box>
              )}
            >
              {courtsList?.items?.map((court) => (
                <MenuItem key={court.id} value={String(court.id)}>
                  {court.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
