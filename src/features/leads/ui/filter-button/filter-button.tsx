import { Badge, Button } from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import FilterIcon from "../../../../shared/assets/icons/filter.svg?react"

interface FilterButtonProps {
  activeFilters: number
  isExpanded: boolean
  isMobile?: boolean
  height?: number
  onClick: () => void
}

export function FilterButton({ isExpanded, isMobile = false, onClick, activeFilters }: FilterButtonProps) {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      startIcon={<FilterIcon />}
      fullWidth={isMobile}
      endIcon={isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      sx={{
        border:"1px solid #888888",
        color:"#888888",
        height: isMobile ? 32 : 'auto',
        alignSelf: 'center',
        textTransform: 'uppercase',
        fontWeight: 500,
        fontSize: '14px',
        px: 2,
        py: 1,
        position: 'relative',
      }}>
      Filter
      <Badge
        badgeContent={activeFilters}
        sx={{
          position: 'absolute',
          top: 4,
          left: 20,
          '& .MuiBadge-badge': {
            backgroundColor: '#034C53',
            color: 'white',
            fontSize: '12px',
            fontWeight: 600,
            minWidth: '20px',
            height: '20px',
            borderRadius: '10px',
          },
        }}
      />
    </Button>
  )
}
