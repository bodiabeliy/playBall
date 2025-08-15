import { useState } from 'react'
import type { MouseEvent } from 'react'
import { Button, Menu, MenuItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { Add, Business } from '@mui/icons-material'
import ClubIcon from '../../../assets/icons/Club.svg?react'
import { useTranslation } from 'react-i18next'
import { getCreateClubRoute } from '../../../types/routes'
import { useNavigate } from 'react-router'
import { useSidebarLayoutContext } from '../../../contexts/sidebar-layout-context'

export interface Club {
  id: string
  name: string
  address?: string
  isActive?: boolean
}

interface ClubSelectorProps {
  Clubs: Club[]
  selectedClub: Club | null
  onClubSelect: (Club: Club) => void
  disabled?: boolean
}

export const ClubSelector = ({ Clubs, selectedClub, onClubSelect, disabled = false }: ClubSelectorProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const { handleDrawerToggle } = useSidebarLayoutContext()

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    if (!disabled) setAnchorEl(event.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)

  const handleClubSelect = (Club: Club) => {
    onClubSelect(Club)
    handleClose()
  }
  const handleCreateClub = () => {
    handleClose()
    navigate(getCreateClubRoute())
    handleDrawerToggle()
  }

  return (
    <>
      <Button
        variant="text"
        onClick={handleOpen}
        disabled={disabled}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          minWidth: 0,
          color: 'white',
          textTransform: 'none',
          px: 2,
          py: 1,
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '15px',
          bgcolor: 'rgba(255,255,255,0.06)',
          '&:hover': {
            bgcolor: 'rgba(90,103,216,0.15)',
          },
        }}
        startIcon={<ClubIcon style={{ fontSize: 18, color: 'white' }} />}>
        {selectedClub?.name || ''}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: '#2c334a',
            color: 'white',
            minWidth: 220,
            boxShadow: 3,
            borderRadius: 2,
            mt: 1,
            p: 0,
          },
        }}
        MenuListProps={{ sx: { p: 0 } }}>
        {Clubs.map((Club) => (
          <MenuItem
            key={Club.id}
            selected={selectedClub?.id === Club.id}
            onClick={() => handleClubSelect(Club)}
            sx={{
              bgcolor: selectedClub?.id === Club.id ? '#343b51' : 'transparent',
              '&:hover': { bgcolor: '#343b51' },
              px: 2,
              py: 1.2,
              gap: 1,
            }}>
            <ListItemIcon sx={{ minWidth: 32, color: 'white' }}>
              <Business fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  sx={{ fontWeight: selectedClub?.id === Club.id ? 600 : 400, fontSize: 15, color: 'white' }}>
                  {Club.name}
                </Typography>
              }
            />
          </MenuItem>
        ))}
        <MenuItem
          onClick={handleCreateClub}
          sx={{
            color: '#9da2fa',
            fontWeight: 500,
            fontSize: 15,
            gap: 1,
            px: 2,
            py: 1.2,
            '&:hover': {
              color: 'white',
              bgcolor: '#343b51',
            },
          }}>
          <ListItemIcon sx={{ minWidth: 32, color: '#9da2fa' }}>
            <Add fontSize="small" />
          </ListItemIcon>
          {t('Club-selector.create-Club')}
        </MenuItem>
      </Menu>
    </>
  )
}
