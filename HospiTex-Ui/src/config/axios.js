import axios from 'axios';

// Create axios instance for API calls
const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, // Enable sending/receiving cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - can be used to add auth headers if needed
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - please login again');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

