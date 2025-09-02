import { useEffect, useState } from 'react'
import { Dialog, DialogContent, Box, Typography, TextField, Button, FormControl, Select, MenuItem, InputLabel, FormControlLabel, Checkbox } from '@mui/material'
import type { ICourt } from '../../../../app/providers/types/court'

interface EditCourtDialogProps {
  open: boolean
  onClose: () => void
  onSave: (court: ICourt) => void
  court: ICourt | null
}

export function EditCourtDialog({ open, onClose, onSave, court }: EditCourtDialogProps) {
  const [courtData, setCourtData] = useState<ICourt>({
    name: '',
    sport_type: '',
    court_type: '',
    description: '',
    category: '',
    is_active: true
  })

  useEffect(() => {
    if (court) {
      setCourtData({
        id: court.id,
        name: court.name || '',
        sport_type: court.sport_type || '',
        court_type: court.court_type || '',
        description: court.description || '',
        category: court.category || '',
        is_active: court.is_active || false,
        club_id: court.club_id
      })
    }
  }, [court])

  const handleFieldChange = (field: keyof ICourt, value: string | boolean) => {
    setCourtData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    onSave(courtData)
    // onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '8px' } }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 3, 
        pb: 2,
        borderBottom: '1px solid #f0f0f0'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 500, flex: 1, fontSize: 20 }}>
          Edit Court
        </Typography>
        <Box 
          onClick={onClose}
          sx={{ 
            cursor: 'pointer',
            fontSize: 24,
            fontWeight: 300,
            color: '#999'
          }}
        >
          ×
        </Box>
      </Box>
      
      {/* Form Content */}
      <DialogContent sx={{ p: 3, pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField 
            label="Court Name (optional)" 
            fullWidth
            value={courtData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            InputProps={{
              sx: { borderRadius: '8px' }
            }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Sports</InputLabel>
            <Select
              value={courtData.sport_type}
              label="Sports"
              onChange={(e) => handleFieldChange('sport_type', e.target.value)}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="padel">Padel</MenuItem>
              <MenuItem value="tennis">Tennis</MenuItem>
              <MenuItem value="pickleball">Pickleball</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={courtData.court_type}
              label="Type"
              onChange={(e) => handleFieldChange('court_type', e.target.value)}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="indoor">Indoor</MenuItem>
              <MenuItem value="outdoor">Outdoor</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Size</InputLabel>
            <Select
              value={courtData.category || ''}
              label="Size"
              onChange={(e) => handleFieldChange('category', e.target.value)}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="single">Single</MenuItem>
              <MenuItem value="double">Double</MenuItem>
            </Select>
          </FormControl>
          
          <TextField 
            label="Description (optional)" 
            fullWidth
            multiline
            minRows={4}
            value={courtData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            InputProps={{
              sx: { borderRadius: '8px' }
            }}
          />
          
          <FormControlLabel 
            control={
              <Checkbox 
                checked={courtData.is_active}
                onChange={(e) => handleFieldChange('is_active', e.target.checked)}
                sx={{
                  color: '#034C53',
                  '&.Mui-checked': {
                    color: '#034C53',
                  }
                }}
              />
            } 
            label="Active Court"
            sx={{ mt: 1 }}
          />
        </Box>
      </DialogContent>

      {/* Footer Buttons */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1.5,
        px: 3, 
        pb: 3, 
        justifyContent: 'space-between'
      }}>
        <Button
          variant="outlined"
          sx={{ 
            borderColor: '#e0e0e0', 
            color: 'rgba(0,0,0,0.7)',
            padding: '12px 20px',
            textTransform: 'none',
            fontSize: '15px',
            borderRadius: '8px',
            flex: 0.4,
            fontWeight: 500
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          sx={{ 
            bgcolor: '#034C53',
            padding: '12px 20px',
            color: 'white',
            textTransform: 'none',
            fontSize: '15px',
            borderRadius: '8px',
            flex: 0.6,
            fontWeight: 500,
            '&:hover': {
              bgcolor: '#023840'
            }
          }} 
          onClick={handleSave}
        >
          Update
        </Button>
      </Box>
    </Dialog>
  )
}
