import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'https://jobhunt-backend-tl22.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add common headers
api.interceptors.request.use(
  (config) => {
    // Add any common headers here if needed
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
      // Handle unauthorized access
      console.log('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export default api; 