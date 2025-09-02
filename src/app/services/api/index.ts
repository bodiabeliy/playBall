import axios from 'axios'
import { clearTokens } from '../../../shared/utils/tokenUtils'

const $api = axios.create({
  baseURL: process.env.VITE_API_URL,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
  },
  // withCredentials:true
})

$api.interceptors.request.use((configuration) => {
  configuration.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return configuration
})

// Response interceptor for handling refresh token
$api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 (Unauthorized) and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refresh')
      
      if (!refreshToken) {
        // No refresh token available, logout user
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        // Try to refresh the token using the correct endpoint and payload
        const refreshResponse = await axios.post(
          `${process.env.VITE_API_URL}/api/v1/club-panel/auth/token/refresh`,
          { refresh_token: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': '*/*'
            }
          }
        )

        if (refreshResponse.data?.access_token) {
          // Store the new tokens
          localStorage.setItem('token', refreshResponse.data.access_token)
          if (refreshResponse.data?.refresh_token) {
            localStorage.setItem('refresh', refreshResponse.data.refresh_token)
          }

          // Update the Authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`

          // Retry the original request
          return $api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        
        // Clear tokens and redirect to login
        clearTokens()
        
        // Dispatch logout action if we have access to store
        // For now, force redirect to login
        window.location.href = '/login'
        
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)


export default $api
