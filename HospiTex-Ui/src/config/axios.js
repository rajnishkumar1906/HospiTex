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
    // Only log 401 errors if they're unexpected (not from auth check endpoints)
    const isAuthEndpoint = error.config?.url?.includes('/auth/');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Unauthorized access on protected routes - this is expected if user isn't logged in
      // Don't spam console with errors for expected behavior
    }
    return Promise.reject(error);
  }
);

export default apiClient;

