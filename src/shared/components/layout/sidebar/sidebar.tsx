import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { useNavigate, useLocation } from 'react-router'
import ClinicIcon from '../../../assets/icons/clinic.svg?react'
import { ClinicSelector } from '../../ui/clinic-selector'
import { SidebarSectionComponent, UserProfileComponent } from './ui'
import { useSidebarLayoutContext } from '../../../contexts/sidebar-layout-context'
import { SIDEBAR_SECTIONS, MOCK_CLINICS, USER_PROFILE } from './model'
import type { Clinic, SidebarItem } from './model'

interface SidebarProps {
  isCollapsed: boolean
}

export const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isMobile, forceCloseMobileSidebar, isNavigating, setIsNavigating, setIsSidebarCollapsed } =
    useSidebarLayoutContext()

  // State for expandable items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [selectedClinic, setSelectedClinic] = useState<Clinic>(MOCK_CLINICS[0])

  // Auto-expand items based on current route
  useEffect(() => {
    // Don't auto-expand during navigation
    if (isNavigating) return

    const currentPath = location.pathname

    // Find the item that matches the current route
    const findItemByPath = (sections: typeof SIDEBAR_SECTIONS): string | null => {
      for (const section of sections) {
        for (const item of section.items) {
          if (item.link === currentPath && item.hasSubItems) {
            return item.id
          }
        }
      }
      return null
    }

    const itemToExpand = findItemByPath(SIDEBAR_SECTIONS)

    if (itemToExpand) {
      // Add a delay on mobile to avoid conflicts with sidebar closing
      const delay = isMobile ? 200 : 0
      setTimeout(() => {
        setExpandedItems((prev) => ({
          ...prev,
          [itemToExpand]: true,
        }))
      }, delay)
    }
  }, [location.pathname, isMobile, isNavigating])

  const handleClinicSelect = (clinic: Clinic) => {
    setSelectedClinic(clinic)
    console.log('Selected clinic:', clinic)
  }

  const handleNavigation = (item: SidebarItem) => {
    if (item.link && !isNavigating) {
      setIsNavigating(true)

      if (isMobile) {
        forceCloseMobileSidebar()
      }

      navigate(item.link!)

      const delay = isMobile ? 1200 : 200
      setTimeout(() => {
        setIsNavigating(false)

        if (isMobile) {
          forceCloseMobileSidebar()
        }
      }, delay)
    }
  }

  const handleToggleItem = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const handleSettingsClick = () => {
    if (!isNavigating) {
      setIsNavigating(true)

      if (isMobile) {
        forceCloseMobileSidebar()
      }

      navigate(USER_PROFILE.settingsLink)

      const delay = isMobile ? 1200 : 200
      setTimeout(() => {
        setIsNavigating(false)

        if (isMobile) {
          forceCloseMobileSidebar()
        }
      }, delay)
    }
  }

  const isActive = (link?: string) => {
    return link ? location.pathname === link : false
  }

  const getActiveStyles = (isItemActive: boolean) => ({
    bgcolor: isItemActive ? '#5a67d8' : 'transparent',
    '&:hover': { bgcolor: isItemActive ? '#5a67d8' : 'rgba(255,255,255,0.08)' },
  })

  const getActiveIconStyles = (isItemActive: boolean) => ({
    color: isItemActive ? 'white' : 'rgba(255,255,255,0.7)',
    minWidth: isCollapsed ? 'auto' : '32px',
    justifyContent: 'center',
  })

  const getActiveTextStyles = (isItemActive: boolean) => ({
    fontSize: '14px',
    color: isItemActive ? 'white' : 'inherit',
  })

  useEffect(() => {
    if (window.innerWidth < 1500) {
      setIsSidebarCollapsed(true)
    }
  }, [])

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#2c334a',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'padding 0.3s ease-in-out',
        overflow: 'hidden',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(255, 255, 255, 0.5)',
        },
      }}>
      <Box
        sx={{
          p: isCollapsed ? '12px 8px' : '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          margin: '16px 8px',
          flexShrink: 0,
        }}>
        {isCollapsed ? (
          <ClinicIcon
            style={{
              fontSize: 24,
              color: 'white',
            }}
          />
        ) : (
          <ClinicSelector clinics={MOCK_CLINICS} selectedClinic={selectedClinic} onClinicSelect={handleClinicSelect} />
        )}
      </Box>
      <Box
        sx={{
          flex: 1,
          overflow: isMobile ? 'auto' : 'hidden',
          display: 'flex',
          flexDirection: 'column',
          ...(isMobile && {
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }),
          ...(!isMobile && {
            '&:hover': {
              overflow: 'auto',
            },
          }),
        }}>
        {SIDEBAR_SECTIONS.map((section) => (
          <SidebarSectionComponent
            key={section.id}
            section={section}
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            expandedItems={expandedItems}
            onToggleItem={handleToggleItem}
            onItemClick={handleNavigation}
            getActiveStyles={getActiveStyles}
            getActiveIconStyles={getActiveIconStyles}
            getActiveTextStyles={getActiveTextStyles}
            isItemActive={isActive}
          />
        ))}
      </Box>
      <Box sx={{ flexShrink: 0 }}>
        <UserProfileComponent
          isCollapsed={isCollapsed}
          settingsLink={USER_PROFILE.settingsLink}
          onSettingsClick={handleSettingsClick}
        />
      </Box>
    </Box>
  )
}
