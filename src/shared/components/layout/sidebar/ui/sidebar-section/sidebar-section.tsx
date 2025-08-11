import { List, type TypographyProps, type Theme, type SxProps } from '@mui/material'
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

  return (
    <>
     
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
    </>
  )
}
