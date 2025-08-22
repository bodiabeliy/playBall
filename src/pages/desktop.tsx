import { useSelector } from 'react-redux'
import { isUserAuthSelector } from '../app/providers/reducers/UserSlice'


import { Typography } from '@mui/material'

import { SidebarLayout } from '../shared'

export function DesktopPage() {
  const isAuthorization = useSelector(isUserAuthSelector)



  return (
    <SidebarLayout
      title="Робочий стіл"
    >
      <Typography>Dashboard</Typography>
      {isAuthorization && 'User already login'}
    </SidebarLayout>
  )
}
