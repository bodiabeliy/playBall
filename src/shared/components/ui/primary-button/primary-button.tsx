import { Button } from '@mui/material'
import type { ButtonProps } from '@mui/material'
import type { ReactNode } from 'react'

interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {
  children: ReactNode
  startIcon?: ReactNode
}

export function PrimaryButton({ children, startIcon, ...props }: PrimaryButtonProps) {
  return (
    <Button
      variant="contained"
      startIcon={startIcon}
      {...props}
      sx={{
        minHeight: '35px',
        height: '30px',
        padding: '0 16px',
        borderRadius: '8px',
        boxShadow:
          '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
        background: '#034C53',
        textTransform: 'uppercase',
        width: 'max-content',
        fontSize: 13,
        ...props.sx,
      }}>
      {children}
    </Button>
  )
}
