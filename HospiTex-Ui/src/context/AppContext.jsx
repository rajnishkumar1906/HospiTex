import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [backendError, setBackendError] = useState(false);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    timeout: 30000, // Increased from 10000 to 30000 to prevent timeout
  });

  // Add token to every request
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      console.log('Interceptor - Token from localStorage:', token ? 'Exists' : 'Not found');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle response errors
  api.interceptors.response.use(
    (response) => {
      console.log('Response interceptor - Status:', response.status);
      return response;
    },
    (error) => {
      console.log('Response error:', error.response?.status, error.message);
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        setBackendError(true);
      }
      if (error.response?.status === 401) {
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          setUser(null);
        }
      }
      return Promise.reject(error);
    }
  );

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    console.log('checkAuth - Token exists:', !!token);
    
    if (!token) {
      setLoading(false);
      return false;
    }

    try {
      const response = await api.post('/auth/is-auth');
      console.log('checkAuth response:', response.data);
      
      if (response.data.success) {
        const userData = response.data.data.user;
        setUser(userData);
        localStorage.setItem('userRole', userData.role);
        setBackendError(false);
        return true;
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Login attempt:', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        const responseData = response.data.data;
        const userData = responseData.user;
        const token = responseData.token;
        
        console.log('Login - Received token:', token ? 'Yes' : 'No');
        
        // Store token
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token saved to localStorage');
        } else {
          console.error('No token received from server!');
        }
        
        localStorage.setItem('userRole', userData.role);
        
        // Set user state
        setUser(userData);
        setBackendError(false);
        toast.success(`Welcome back, ${userData.username}! 🎉`);
        
        // Return warning if account not verified
        return { success: true, user: userData, warning: responseData.warning };
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const signup = async (userData) => {
    try {
      console.log('Signup attempt:', userData.email);
      const response = await api.post('/auth/signup', userData);
      console.log('Signup response:', response.data);
      
      if (response.data.success) {
        const responseData = response.data.data;
        const user = responseData.user;
        const token = responseData.token;
        
        console.log('Signup - Received user:', user);
        console.log('Signup - Received token:', token ? 'Yes' : 'No');
        
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token saved to localStorage');
        }
        
        localStorage.setItem('userRole', user.role);
        setUser(user);
        setBackendError(false);
        
        if (user.role === 'Doctor' || user.role === 'Diagnostic') {
          toast.success('Account created! Please wait for admin verification.');
        } else {
          toast.success('Account created successfully! 🎉');
        }
        
        // Return consistent data structure with user directly accessible
        return { 
          success: true, 
          user: user,
          token: token,
          data: responseData
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      setUser(null);
      toast.success('Logged out successfully');
      window.location.href = '/login';
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const response = await api.get('/notifications');
      if (response.data.success) {
        setNotifications(response.data.data || []);
        const unread = (response.data.data || []).filter(n => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      if (error.code !== 'ERR_NETWORK') {
        console.error('Failed to fetch notifications:', error);
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <AppContext.Provider value={{
      user,
      loading,
      notifications,
      unreadCount,
      backendError,
      api,
      login,
      signup,
      logout,
      checkAuth,
      fetchNotifications,
    }}>
      {children}
    </AppContext.Provider>
  );
};