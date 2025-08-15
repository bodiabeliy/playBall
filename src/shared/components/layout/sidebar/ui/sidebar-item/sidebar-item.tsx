import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Typography,
  IconButton,
  type SxProps,
  type Theme,
  type TypographyProps,
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import type { SidebarItem } from '../../model'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '../../../../../../app/providers/store-helpers'
import { logout } from '../../../../../../app/services/UserService'

interface SidebarItemProps {
  item: SidebarItem
  isCollapsed: boolean
  isMobile: boolean
  isActive: boolean
  isExpanded?: boolean
  onToggle?: () => void
  onClick: () => void
  getActiveStyles: (isActive: boolean) => SxProps<Theme>
  getActiveIconStyles: (isActive: boolean) => SxProps<Theme>
  getActiveTextStyles: (isActive: boolean) => TypographyProps<'span', { component?: 'span' }>
}

export function SidebarItemComponent({
  item,
  isCollapsed,
  isMobile,
  isActive,
  isExpanded = false,
  onToggle,
  onClick,
  getActiveStyles,
  getActiveIconStyles,
  getActiveTextStyles,
}: SidebarItemProps) {
  const IconComponent = item.icon
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()


  const handleMainContentClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (item.link) {
      onClick()
    }
     if (item.isAction) {
       navigate('/', { replace: true })
       dispatch(logout())
    }

  }

  const handleArrowClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (item.hasSubItems && onToggle) {
      onToggle()
    }
  }

  return (
    <>
      <ListItem sx={{ padding: isMobile ? '0 8px' : '0 16px' }}>
        <ListItemButton
          onClick={handleMainContentClick}
          sx={{
            px: isMobile ? 0 : 2,
            borderRadius: '6px',
            py: isCollapsed ? '12px' : '8px',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            minHeight: isCollapsed ? '48px' : 'auto',
            ...getActiveStyles(isActive),
          }}>
          <ListItemIcon sx={getActiveIconStyles(isActive)}>
            <IconComponent style={{ fontSize: isCollapsed ? 20 : 18 }} />
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText primary={t(item.text)} primaryTypographyProps={getActiveTextStyles(isActive)} />
          )}
          {!isCollapsed && item.hasSubItems && (
            <IconButton
              onClick={handleArrowClick}
              size="small"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                padding: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              }}>
              {isExpanded ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
            </IconButton>
          )}
        </ListItemButton>
      </ListItem>
      {!isCollapsed && item.hasSubItems && item.subItems && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" sx={{ mt: '8px', padding: '0 16px' }}>
            {item.subItems.map((subItem) => (
              <ListItemButton
                key={subItem.id}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (subItem.link) {
                    navigate(subItem.link)
                  }
                }}
                sx={{
                  padding: '8px 32px',
                  '&:before': {
                    content: '""',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    marginRight: '16px',
                  },
                }}>
                <Typography variant="body2" sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                  {t(subItem.text)}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}
