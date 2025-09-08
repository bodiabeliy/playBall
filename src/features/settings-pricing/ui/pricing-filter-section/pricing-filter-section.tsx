import { Box, TextField, MenuItem, Button } from '@mui/material'
import type { PricingFilterValues } from '../../model/types'
import { PRICING_SPORT_TYPES, PRICING_TIMED_OPTIONS, PRICING_SORT_OPTIONS } from '../../model/types'

interface PricingFilterSectionProps {
  filters: PricingFilterValues
  onFilterChange: (field: keyof PricingFilterValues, value: string) => void
  onReset: () => void
  onApply: () => void
}

export function PricingFilterSection({ 
  filters, 
  onFilterChange, 
  onReset, 
  onApply 
}: PricingFilterSectionProps) {
  const handleFilterChange = (field: keyof PricingFilterValues, value: string) => {
    onFilterChange(field, value)
  }

  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        border: '2px solid #2196F3',
        borderRadius: '12px',
        background: '#fff',
      }}>
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, 
          gap: 2, 
          mb: 3 
        }}
      >
        <TextField
          select
          label="Sport Type"
          value={filters.sport_type}
          onChange={(e) => handleFilterChange('sport_type', e.target.value)}
          size="small"
          fullWidth
        >
          {PRICING_SPORT_TYPES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Start Date"
          type="date"
          value={filters.start_date}
          onChange={(e) => handleFilterChange('start_date', e.target.value)}
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="End Date"
          type="date"
          value={filters.end_date}
          onChange={(e) => handleFilterChange('end_date', e.target.value)}
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          select
          label="Pricing Type"
          value={filters.is_timed}
          onChange={(e) => handleFilterChange('is_timed', e.target.value)}
          size="small"
          fullWidth
        >
          {PRICING_TIMED_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Sort By"
          value={filters.sort_by}
          onChange={(e) => handleFilterChange('sort_by', e.target.value)}
          size="small"
          fullWidth
        >
          {PRICING_SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Sort Order"
          value={filters.sort_order}
          onChange={(e) => handleFilterChange('sort_order', e.target.value)}
          size="small"
          fullWidth
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </TextField>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onReset}
          sx={{
            borderColor: '#666',
            color: '#666',
            '&:hover': {
              borderColor: '#333',
              color: '#333',
            },
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={onApply}
          sx={{
            backgroundColor: '#034C53',
            '&:hover': {
              backgroundColor: '#023940',
            },
          }}
        >
          Apply Filters
        </Button>
      </Box>
    </Box>
  )
}
