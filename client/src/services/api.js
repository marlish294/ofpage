import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 120000
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        console.log('🌐 API Request:', config.method?.toUpperCase(), config.url)
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Ensure correct content type for FormData uploads
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type']
        } else if (!config.headers['Content-Type'] && config.method && config.method.toLowerCase() !== 'get') {
            config.headers['Content-Type'] = 'application/json'
        }
        return config
    },
    (error) => {
        console.error('🌐 API Request Error:', error)
        return Promise.reject(error)
    }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => {
        console.log('🌐 API Response:', response.status, response.config.url)
        return response
    },
    (error) => {
        console.error('🌐 API Response Error:', error.message, error.config?.url)
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api
