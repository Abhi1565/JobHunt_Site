import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'https://jobhunt-backend-ff5o.onrender.com',
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
    console.log('Auth check failed:', error.response?.data || error.message);
    return false;
  }
};

// Request interceptor to add common headers
api.interceptors.request.use(
  (config) => {
    // Add any common headers here if needed
    console.log('Making request to:', config.url);
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
    console.log('Response error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access - redirecting to login');
      // You can add redirect logic here if needed
    }
    return Promise.reject(error);
  }
);

export default api; 