import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'https://jobhunt-backend-csnc.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to check if user is authenticated
export const checkAuthStatus = async () => {
  try {
    console.log('Checking auth status...');
    const response = await api.get('/api/v1/user/me');
    console.log('Auth check response:', response.data);
    return response.data.success;
  } catch (error) {
    console.log('Auth check failed:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        withCredentials: error.config?.withCredentials,
        headers: error.config?.headers
      }
    });
    return false;
  }
};

// Alternative auth check using a different endpoint
export const checkAuthAlternative = async () => {
  try {
    console.log('Alternative auth check...');
    const response = await api.get('/api/v1/job/test-auth');
    console.log('Alternative auth check response:', response.data);
    return response.data.success;
  } catch (error) {
    console.log('Alternative auth check failed:', error.response?.data || error.message);
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