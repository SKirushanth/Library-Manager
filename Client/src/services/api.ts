import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'
const api = axios.create({
  baseURL,
})

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const method = (config.method ?? 'get').toLowerCase()
  const url = config.url ?? ''
  const isPublicBooksGet = method === 'get' && /^\/books(\/.*)?$/.test(url)

  if (token && !isPublicBooksGet) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors globally — clear session and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api