import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Select,
  MenuItem,
  Switch,
  InputLabel,
  FormControl,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { CheckBox } from '@mui/icons-material'
import SettingsIcon from '../../../../shared/assets/icons/settings_general.svg?react'
import PencilIcon from '../../../../shared/assets/icons/pencil.svg?react'

interface GeneralPriceDetailsDialogProps {
  open: boolean
  onClose: () => void
  onSave: () => void
}

export function GeneralPriceDetailsDialog({ open, onClose, onSave }: GeneralPriceDetailsDialogProps) {
  const handleSave = () => {
    onSave()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, background: '#f4f7fe' }}>
        <SettingsIcon style={{ color: '#0029d9', marginRight: 8 }} />
        <Typography variant="h6" sx={{ fontWeight: 500, flex: 1 }}>
          Деталі прайсу
        </Typography>
      </Box>
      <DialogContent sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, gap: 2 }}>
          <TextField
            label="Вкажіть позиції прайсу"
            fullWidth
            sx={{ background: '#fff', borderRadius: 2, flex: 1 }}
            InputLabelProps={{ shrink: true }}
          />
          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <TextField
              label="Ціна"
              fullWidth
              sx={{ background: '#fff', borderRadius: 2, flex: 1 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Собівартість"
              fullWidth
              sx={{ background: '#fff', borderRadius: 2, flex: 1 }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <FormControl fullWidth sx={{ borderRadius: '8px' }}>
              <InputLabel id="discount-label">Знижка</InputLabel>
              <Select
                labelId="discount-label"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                  width: '100%',
                }}
                label="Знижка">
                <MenuItem value={1}>Так</MenuItem>
                <MenuItem value={2}>Ні</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ borderRadius: '8px' }}>
              <InputLabel id="discount-value-label">Знижка</InputLabel>
              <Select
                labelId="discount-value-label"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                  width: '100%',
                }}
                label="Знижка">
                <MenuItem value={10}>10%</MenuItem>
                <MenuItem value={20}>20%</MenuItem>
                <MenuItem value={30}>30%</MenuItem>
                <MenuItem value={40}>40%</MenuItem>
                <MenuItem value={50}>50%</MenuItem>
                <MenuItem value={60}>60%</MenuItem>
                <MenuItem value={70}>70%</MenuItem>
                <MenuItem value={80}>80%</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {/* <UniversalTimePicker label="Час на маніпуляцію (стандарт)" /> */}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckBox sx={{ color: '#0029d9' }} />
          <Typography variant="body1">Номенклатура потребує фотопротоколу</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Switch />
          <Typography variant="body1">Активувати розширені питання</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <FormControl fullWidth sx={{ borderRadius: '8px' }}>
            <InputLabel id="question-label">Оберіть пункт</InputLabel>
            <Select label="Оберіть пункт" fullWidth>
              <MenuItem value={1}>Назва1</MenuItem>
              <MenuItem value={2}>Назва2</MenuItem>
            </Select>
          </FormControl>
          <IconButton>
            <PencilIcon />
          </IconButton>
        </Box>
      </DialogContent>
      <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', px: 3, pb: 3, pt: 1, mt: 2 }}>
        <IconButton>
          <DeleteIcon sx={{ color: '#000', fillOpacity: 0.56 }} />
        </IconButton>
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
