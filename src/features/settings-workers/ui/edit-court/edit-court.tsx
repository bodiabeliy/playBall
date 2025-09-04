import { useEffect, useState } from 'react'
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
  Checkbox,
} from '@mui/material'
import type { ICourt } from '../../../../app/providers/types/court'
import CloseIcon from '@mui/icons-material/Close'

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
    is_active: true,
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
        club_id: court.club_id,
      })
    }
  }, [court])

  const handleFieldChange = (field: keyof ICourt, value: string | boolean) => {
    setCourtData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    onSave(courtData)
    // onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '8px' } }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 3,
          pb: 2,
          borderBottom: '1px solid #f0f0f0',
        }}>
        <Typography variant="h6" sx={{ flex: 1, fontSize: 20 }}>
          Edit Court
        </Typography>
        <Button
          onClick={onClose}
          sx={{
            minWidth: 'auto',
            p: 0.5,
            color: '#666',
            '&:hover': {
              background: 'transparent',
              color: '#000',
            },
          }}>
          <CloseIcon />
        </Button>
      </Box>

      {/* Form Content */}
      <DialogContent sx={{ p: 3, pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <FormControl fullWidth>
            <Typography variant="body2" color="text.secondary">
              Court Name (optional)
            </Typography>
            <TextField
              fullWidth
              value={courtData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              InputProps={{
                sx: { borderRadius: '8px' },
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" color="text.secondary">
              Sports
            </Typography>
            <Select
              value={courtData.sport_type}
              onChange={(e) => handleFieldChange('sport_type', e.target.value)}
              sx={{ borderRadius: '8px' }}>
              <MenuItem value="padel">Padel</MenuItem>
              <MenuItem value="tennis">Tennis</MenuItem>
              <MenuItem value="pickleball">Pickleball</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" color="text.secondary">
              Type
            </Typography>
            <Select
              value={courtData.court_type}
              onChange={(e) => handleFieldChange('court_type', e.target.value)}
              sx={{ borderRadius: '8px' }}>
              <MenuItem value="indoor">Indoor</MenuItem>
              <MenuItem value="outdoor">Outdoor</MenuItem>
              {courtData.sport_type === 'tennis' && <MenuItem value="covered">Covered</MenuItem>}
            </Select>
          </FormControl>

          {courtData.sport_type === 'padel' && (
            <>
              <FormControl fullWidth>
                <Typography variant="body2" color="text.secondary">
                  Size
                </Typography>
                <Select
                  value={courtData.category || ''}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  sx={{ borderRadius: '8px' }}>
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="double">Double</MenuItem>
                  <MenuItem value="multi">Multi-court</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          <FormControl fullWidth>
            <Typography variant="body2" color="text.secondary">
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={4}
              value={courtData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              InputProps={{
                sx: { borderRadius: '8px' },
              }}
            />
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={courtData.is_active}
                onChange={(e) => handleFieldChange('is_active', e.target.checked)}
                sx={{
                  color: '#034C53',
                  '&.Mui-checked': {
                    color: '#034C53',
                  },
                }}
              />
            }
            label="Active Court"
            sx={{ mt: 1 }}
          />
        </Box>
      </DialogContent>

      {/* Footer Buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          px: 3,
          pb: 3,
          justifyContent: 'flex-end',
        }}>
        <Button
          variant="outlined"
          sx={{
            borderRadius: '8px',
            backgroundColor: '#DFDFDF',
            color: 'black',
            border:"none",
            transition: 'none',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
            '&:active': {
              boxShadow: 'none',
            },
          }}
          onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ borderRadius: '8px', backgroundColor: '#034C53', '&:hover': { backgroundColor: '#023a40' } }}
          onClick={handleSave}>
          Update
        </Button>
      </Box>
    </Dialog>
  )
}
