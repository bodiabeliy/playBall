import { useState } from 'react'
import type { MouseEvent } from 'react'
import { Button, Menu, MenuItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import { Add } from '@mui/icons-material'
import ClubIcon from '../../../assets/icons/club.svg?react'
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
  clubs: Club[]
  disabled?: boolean
}

export const ClubSelector = ({ clubs, disabled = false }: ClubSelectorProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const { handleDrawerToggle } = useSidebarLayoutContext()
  const [currentClub, setCurrentClubClub]= useState(clubs[0])

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    if (!disabled) setAnchorEl(event.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)

  
  const handleClubSelect = (club: Club) => {
    setCurrentClubClub(club)
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
          textTransform: 'none',
          px: 2,
          py: 1,
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '15px',
        
        }}
        startIcon={<ClubIcon style={{ fontSize: 18, }} />}>
        {currentClub?.name || ''}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: 220,
            boxShadow: 3,
            borderRadius: 2,
            mt: 1,
            p: 0,
          },
        }}
        MenuListProps={{ sx: { p: 0 } }}>
        {clubs.map((Club) => (
          <MenuItem
            key={Club.id}
            selected={currentClub?.id === Club.id}
            onClick={() => handleClubSelect(Club)}
            sx={{
              bgcolor: currentClub?.id === Club.id ? '#F6F6F6' : 'transparent',
              '&:hover': { bgcolor: '#F6F6F6' },
              px: 2,
              py: 1.2,
              gap: 1,
            }}>
            <ListItemIcon sx={{ minWidth: 32, }}>
              <SportsTennisIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  sx={{ fontWeight: currentClub?.id === Club.id ? 600 : 400, fontSize: 15 }}>
                  {Club.name}
                </Typography>
              }
            />
          </MenuItem>
        ))}
        <MenuItem
          onClick={handleCreateClub}
          sx={{
            fontWeight: 500,
            fontSize: 15,
            gap: 1,
            px: 2,
            py: 1.2,
            '&:hover': {
              bgcolor: '#F6F6F6',
            },
          }}>
          <ListItemIcon sx={{ minWidth: 32,  }}>
            <Add fontSize="small" />
          </ListItemIcon>
          {t('club-selector.create-club')}
        </MenuItem>
      </Menu>
    </>
  )
}
