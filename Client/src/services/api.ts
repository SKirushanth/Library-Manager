import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
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

// Handle 401 errors globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api