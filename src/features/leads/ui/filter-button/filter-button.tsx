import { Badge, Button } from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import CourtIcon from '../../../../shared/assets/icons/courts.svg?react'

interface FilterButtonProps {
  activeFilters: number
  isExpanded: boolean
  isMobile?: boolean
  height?: number
  onClick: () => void
}

export function FilterButton({ isExpanded, isMobile = false, onClick }: FilterButtonProps) {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      startIcon={<CourtIcon style={{scale:0.75}} />}
      fullWidth={isMobile}
      endIcon={isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      sx={{
        border:"1px solid #6e6e6e",
        borderRadius:"12px",
        color:"#6e6e6e",
        alignSelf: 'center',
        fontWeight: 500,
        fontSize: '14px',
        position: 'relative',
      }}>
      All types
      <Badge
        // badgeContent={activeFilters}
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
