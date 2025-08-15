import { useSelector } from 'react-redux'
import { isUserAuthSelector } from '../app/providers/reducers/UserSlice'

import { ClubSelector, } from '../shared/components/ui/club-selector'

import { Typography } from '@mui/material'

import { SidebarLayout } from '../shared'
import { MOCK_CLUBS } from '../shared/components/layout/sidebar'

export function DesktopPage() {
  const isAuthorization = useSelector(isUserAuthSelector)



  return (
    <SidebarLayout
      title="Робочий стіл"
      rightSidebar={<ClubSelector clubs={MOCK_CLUBS} />}
    >
      <Typography>Dashboard</Typography>
      {isAuthorization && 'User already login'}
    </SidebarLayout>
  )
}
