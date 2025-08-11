import { List, Typography, Box, type TypographyProps, type Theme, type SxProps } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SidebarItemComponent } from '../sidebar-item'
import type { SidebarItem, SidebarSection } from '../../model'

interface SidebarSectionProps {
  section: SidebarSection
  isCollapsed: boolean
  isMobile: boolean
  expandedItems: Record<string, boolean>
  onToggleItem: (itemId: string) => void
  onItemClick: (item: SidebarItem) => void
  getActiveStyles: (isActive: boolean) => SxProps<Theme>
  getActiveIconStyles: (isActive: boolean) => SxProps<Theme>
  getActiveTextStyles: (isActive: boolean) => TypographyProps<'span', { component?: 'span' }>
  isItemActive: (link?: string) => boolean
}

export function SidebarSectionComponent({
  section,
  isCollapsed,
  isMobile,
  expandedItems,
  onToggleItem,
  onItemClick,
  getActiveStyles,
  getActiveIconStyles,
  getActiveTextStyles,
  isItemActive,
}: SidebarSectionProps) {
  const { t } = useTranslation()

  return (
    <>
      {!isCollapsed && section.title && (
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            margin: isMobile ? '8px 0 8px 16px' : '8px 0 8px 32px',
            color: '#b9c5fd',
            whiteSpace: 'nowrap',
          }}>
          {t(section.title)}
        </Typography>
      )}
      <List sx={{ p: 0 }}>
        {section.items.map((item) => (
          <SidebarItemComponent
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            isActive={isItemActive(item.link)}
            isExpanded={expandedItems[item.id]}
            onToggle={() => onToggleItem(item.id)}
            onClick={() => onItemClick(item)}
            getActiveStyles={getActiveStyles}
            getActiveIconStyles={getActiveIconStyles}
            getActiveTextStyles={getActiveTextStyles}
          />
        ))}
      </List>
      {!isCollapsed && section.id !== 'services' && (
        <Box
          sx={{
            backgroundColor: '#9da2fa',
            width: 'calc(100% - 32px)',
            height: '1px',
            margin: '8px 16px',
          }}
        />
      )}
    </>
  )
}
