import { useSelector } from 'react-redux'
import { isUserAuthSelector } from '../app/providers/reducers/UserSlice'

import { Typography, IconButton } from '@mui/material'

import { SidebarLayout } from '../shared'
import MoreVerticalIcon from '../shared/assets/icons/more-vertical.svg?react'
import BellIcon from '../shared/assets/icons/bell.svg?react'

export function DesktopPage() {
  const isAuthorization = useSelector(isUserAuthSelector)

  return (
    <SidebarLayout
      title="Робочий стіл"
      rightSidebar={
        <>
          <IconButton
            sx={{
              background: '#f5f7fe',
              border: '1px solid rgba(0, 41, 217, 0.3)',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
            }}>
            <MoreVerticalIcon style={{ color: '#8a4bdc' }} />
          </IconButton>
          <IconButton
            sx={{
              background: '#8a4bdc',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
            }}>
            <BellIcon style={{ color: 'white' }} />
          </IconButton>
        </>
      }>
      <Typography>Головна</Typography>
      {isAuthorization && 'Користувач увійшов'}
    </SidebarLayout>
  )
}
