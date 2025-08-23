import { Button, useTheme, useMediaQuery } from '@mui/material'
import EditButtonIcon from "../../../shared/assets/icons/edit.svg?react"

interface UpdateSectionButtonProps {
  onClick: () => void
}

export function UpdateSectionButton({ onClick }: UpdateSectionButtonProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Button
      variant="contained"
      startIcon={<EditButtonIcon />}
      onClick={onClick}
      sx={{
        background:"rgba(223, 223, 223, 1)",
        color:"black",
        '& .MuiButton-startIcon': {
          marginRight: isMobile ? 0 : '8px',
          marginLeft: isMobile ? 0 : '-4px',
        },
      }}>
      {!isMobile ? 'Edit' : null}
    </Button>
  )
}
