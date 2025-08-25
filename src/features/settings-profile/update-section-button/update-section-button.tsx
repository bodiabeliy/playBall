import { Button, useTheme, useMediaQuery } from '@mui/material'
import EditButtonIcon from "../../../shared/assets/icons/edit.svg?react"

interface UpdateSectionButtonProps {
  onClick: () => void
  isAccordionCollapse:boolean
}

export function UpdateSectionButton({ onClick, isAccordionCollapse }: UpdateSectionButtonProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to accordion
    onClick();
  };
  
  return (
    <Button
      variant="contained"
      startIcon={!isAccordionCollapse && <EditButtonIcon />}
      onClick={handleClick}
      sx={{
        background: !isAccordionCollapse ? "rgba(223, 223, 223, 1)" : "#034C53",
        color: !isAccordionCollapse ? "black" : "white",
        transform: !isAccordionCollapse ? "rotate(0deg)" : "rotate(180deg)",
        '& .MuiButton-startIcon': {
          marginRight: isMobile ? 0 : '8px',
          marginLeft: isMobile ? 0 : '-4px',
        },
      }}>
      {!isAccordionCollapse ? 'Edit' : " Update"}
    </Button>
  )
}
