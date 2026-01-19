import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 403 errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            toast.error('Access denied. Redirecting to dashboard...');
            setTimeout(() => {
                window.location.href = '/admin/dashboard';
            }, 1500);
        }
        return Promise.reject(error);
    }
);

export default api;