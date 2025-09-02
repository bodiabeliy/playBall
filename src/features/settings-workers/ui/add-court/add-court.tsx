import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useAppDispatch, useAppSelector } from '../../../../app/providers/store-helpers'
import { clubSelector } from '../../../../app/providers/reducers/ClubSlice'
import { createCourt } from '../../../../app/services/CourtService'
import type { ICourt } from '../../../../app/providers/types/court'

interface AddCourtDialogProps {
  open: boolean
  onClose: () => void
  onSave: () => void
  currentSportType:string
}

export function AddCourtDialog({ open, onClose, onSave, currentSportType }: AddCourtDialogProps) {
  const dispatch = useAppDispatch()
  const currentClub = useAppSelector(clubSelector)
  
  const [formData, setFormData] = useState<ICourt>({
    name: '',
    sport_type: '',
    court_type: '',
    category: '',
    description: '',
    is_active: true,
  })

  const handleFieldChange = (field: keyof ICourt, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (currentClub && currentClub.id) {
      try {
        const courtData = {
          ...formData
        }
        await dispatch(createCourt(currentClub.id, courtData))
        onSave()
        onClose()
        // Reset form after successful save
        setFormData({
          name: '',
          sport_type: 'padel',
          court_type: '',
          category: '',
          description: '',
          is_active: true,
        })
      } catch (error) {
        console.error('Failed to create court:', error)
      }
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2.5, 
        background: '#f8f9fb',
        borderBottom: '1px solid #eaedf3'
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 600, 
          fontSize: '18px',
          color: '#1a1a1a'
        }}>
          Add Court
        </Typography>
        <Button 
          onClick={onClose}
          sx={{ 
            minWidth: 'auto', 
            p: 0.5,
            color: '#666',
            '&:hover': {
              background: 'transparent',
              color: '#000'
            }
          }}
        >
          <CloseIcon />
        </Button>
      </Box>
      <DialogContent sx={{ px: 3, py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
              Court Name (optional)
            </Typography>
            <TextField
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Enter court name"
              variant="outlined"
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                }
              }}
            />
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
              Sports
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={formData.sport_type}
                onChange={(e) => handleFieldChange('sport_type', e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                }}
              >
                <MenuItem value="padel">Padel</MenuItem>
                <MenuItem value="tennis">Tennis</MenuItem>
                <MenuItem value="pickleball">Pickleball</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
              Type
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={formData.court_type}
                onChange={(e) => handleFieldChange('court_type', e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                }}
              >
                <MenuItem value="indoor">Indoor</MenuItem>
                <MenuItem value="outdoor">Outdoor</MenuItem>
                {currentSportType === 'tennis' && <MenuItem value="covered">Covered</MenuItem>}
              </Select>
            </FormControl>
          </Box>
          
          {currentSportType === 'Padel' && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                Size
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.category || ''}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  displayEmpty
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                  }}
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="double">Double</MenuItem>
                  <MenuItem value="multi">Multi-court</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          
         
          
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
              Description (optional)
            </Typography>
            <TextField
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Enter description"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                }
              }}
            />
          </Box>
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={formData.is_active} 
                onChange={(e) => handleFieldChange('is_active', e.target.checked)}
                sx={{
                  color: '#ccc',
                  '&.Mui-checked': {
                    color: '#034C53',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
                Active Court
              </Typography>
            }
            sx={{ 
              my: 1
            }}
          />
        </Box>
      </DialogContent>
      <Box sx={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'flex-end', 
        px: 3, 
        pb: 3, 
        borderTop: 'none' 
      }}>
        <Button
          variant="outlined"
          sx={{ 
            borderColor: '#ccc', 
            color: '#333', 
            padding: '10px 24px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              borderColor: '#999',
              background: '#f5f5f5',
            } 
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          sx={{ 
            backgroundColor: '#034C53', 
            padding: '10px 24px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#023a40',
            }
          }} 
          onClick={handleSave}
        >
          Add Court
        </Button>
      </Box>
    </Dialog>
  )
}
