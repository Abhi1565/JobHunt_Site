import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to check if user is authenticated
export const checkAuthStatus = async () => {
  try {
    const response = await api.get('/api/v1/user/me');
    return response.data.success;
  } catch (error) {
    return false;
  }
};

// Request interceptor to add common headers
api.interceptors.request.use(
  (config) => {
    // Add Authorization header if token exists in localStorage
    const token = localStorage.getItem('authToken');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access silently
    }
    return Promise.reject(error);
  }
);

export default api;