import axios from 'axios'

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

      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${process.env.VITE_API_URL}/auth/token/refresh`,
          {},
          { withCredentials: true } // Important for sending cookies
        )

        if (refreshResponse.data?.access_token) {
          // Store the new access token
          localStorage.setItem('token', refreshResponse.data.access_token)

          // Update the Authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`

          // Retry the original request
          return $api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
      }
    }

    return Promise.reject(error)
  }
)


export default $api
