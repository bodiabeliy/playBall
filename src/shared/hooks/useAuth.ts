import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/providers/store-helpers'
import { isAuth, isUserAuthSelector } from '../../app/providers/reducers/UserSlice'
import { areTokensValid, clearTokens, isTokenExpired } from '../utils/tokenUtils'

/**
 * Custom hook for managing authentication state
 * Handles token validation, refresh, and logout
 */
export const useAuth = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(isUserAuthSelector)

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      const { isValid, hasRefreshToken } = areTokensValid()
      
      if (isValid && hasRefreshToken) {
        // Check if access token is expired
        const accessToken = localStorage.getItem('token')
        if (accessToken && isTokenExpired(accessToken)) {
          console.log('Access token expired, will be refreshed on next API call')
        }
        dispatch(isAuth(true))
      } else {
        // Clear invalid tokens and logout
        clearTokens()
        dispatch(isAuth(false))
      }
    }

    initializeAuth()
  }, [dispatch])

  // Listen for token changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'refresh') {
        const { isValid } = areTokensValid()
        
        if (!isValid && isAuthenticated) {
          // Tokens are no longer valid, logout
          dispatch(isAuth(false))
        } else if (isValid && !isAuthenticated) {
          // Tokens became valid (user logged in from another tab)
          dispatch(isAuth(true))
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [dispatch, isAuthenticated])

  // Manual logout function
  const logout = () => {
    clearTokens()
    dispatch(isAuth(false))
  }

  // Check if user has valid tokens
  const hasValidTokens = () => {
    const { isValid } = areTokensValid()
    return isValid
  }

  return {
    isAuthenticated,
    logout,
    hasValidTokens,
  }
}
