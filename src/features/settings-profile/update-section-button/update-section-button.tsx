import { Button, useTheme, useMediaQuery } from '@mui/material'
import EditButtonIcon from "../../../shared/assets/icons/edit.svg?react"
import { useAppDispatch } from '../../../app/providers/store-helpers'
import type { AnyAction } from '@reduxjs/toolkit'

// Define a flexible type for dispatch action creators
type ActionCreator<T = unknown> = (data: T) => AnyAction | ((dispatch: unknown) => Promise<void>)

interface UpdateSectionButtonProps<T = unknown> {
  onClick: (formData?: T) => void
  isAccordionCollapse: boolean
  formData?: T
  sectionId?: string
  actionCreator?: ActionCreator<T>
  actionParams?: Record<string, unknown>
  expandedLabel?: string
  collapsedLabel?: string
}

export function UpdateSectionButton<T>({ 
  onClick, 
  isAccordionCollapse, 
  formData, 
  sectionId,
  actionCreator,
  actionParams = {},
  expandedLabel,
  collapsedLabel
}: UpdateSectionButtonProps<T>) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useAppDispatch()
  
  // When expanded and label is "Close", render as neutral gray action
  const isCloseExpanded = isAccordionCollapse && (expandedLabel?.trim().toLowerCase() === 'close')
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to accordion
    
    // Only pass form data when saving (when accordion is expanded)
    if (isAccordionCollapse && formData) {
      console.log(`Updating ${sectionId} with data:`, formData);
      
      // Dispatch action if an action creator was provided
      if (actionCreator && formData) {
        // Create a dynamic action based on the provided parameters
        if (actionParams && Object.keys(actionParams).length > 0) {
          // If we have additional params, we need to combine them with the form data
          const action = actionCreator({ ...actionParams, ...formData });
          dispatch(action);
        } else {
          // Simple case: just dispatch with the form data
          const action = actionCreator(formData);
          dispatch(action);
        }
      }
      
      onClick(formData);
    } else {
      onClick();
    }
  };
  
  return (
    <Button
      variant="contained"
      startIcon={!isAccordionCollapse && <EditButtonIcon />}
      onClick={handleClick}
      sx={{
        textTransform:"capitalize",
        background: !isAccordionCollapse
          ? "rgba(223, 223, 223, 1)"
          : (isCloseExpanded ? "#DFDFDF" : "#034C53"),
        color: !isAccordionCollapse
          ? "black"
          : (isCloseExpanded ? "black" : "white"),
        // prevent any rotation or transitions and remove all shadows
        transition: 'none',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
        '&:active': {
          boxShadow: 'none',
        },
        '& .MuiButton-startIcon': {
          marginRight: isMobile ? 0 : '8px',
          marginLeft: isMobile ? 0 : '-4px',
        },
      }}>
      {!isAccordionCollapse ? (collapsedLabel ?? 'Show') : (expandedLabel ?? 'Update')}
    </Button>
  )
}
