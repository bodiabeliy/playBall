
import { Box, Typography } from '@mui/material'
import {  useAppSelector } from '../../../../../../app/providers/store-helpers'
import { userSelector } from '../../../../../../app/providers/reducers/UserSlice'

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'

interface UserProfileProps {
  isCollapsed: boolean
  settingsLink: string
  onSettingsClick: () => void
}

export function UserProfileComponent({ isCollapsed, onSettingsClick }: UserProfileProps) {
  const currentUser = useAppSelector(userSelector)

  return (
    <Box
      sx={{
        mt: 'auto',
        p: isCollapsed ? '8px 0' : '8px',
        display: 'flex',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          p: isCollapsed ? 0 : '16px 8px',
          bgcolor: 'transparent',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'background 0.2s',
          width: '100%',
          '&:hover': {
            background: 'rgba(255,255,255,0.08)',
          },
        }}
        tabIndex={0}
        role="button"
        aria-label="Перейти до налаштувань профілю">
        {!isCollapsed && (
          <Box>
            <Box sx={{ display: 'flex' }}>
              {currentUser.photo != null ? (
                <img
                  src={currentUser?.photo}
                  alt="User Avatar"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.2)',
                  }}
                />
              ) : (
                <AccountCircleOutlinedIcon sx={{ mt: 1 }} />
              )}

              <Box sx={{ marginLeft: '6px' }} onClick={onSettingsClick}>
                <Typography sx={{ fontWeight: 500, fontSize: '14px', whiteSpace: 'nowrap', }}>
                  {currentUser?.firstname + ' ' + currentUser.lastname}
                </Typography>
                <Typography sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {currentUser?.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
