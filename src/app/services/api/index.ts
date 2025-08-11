import axios from 'axios'

const $api = axios.create({
  baseURL: process.env.VITE_API_URL,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
  },
})

$api.interceptors.request.use((configuration) => {
  configuration.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return configuration
})

export default $api
