import React, { createContext, useCallback, useEffect, useState } from 'react';
import apiClient from '../config/axios';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendURL = "http://localhost:5000";

  const [IsLoggedIn, setIsLoggedIn] = useState(false);
  const [UserRole, setUserRole] = useState(null);
  const [User, setUser] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.post('/auth/is-auth');
        if (response.data.success && response.data.userId) {
          // Fetch user details to get role
          try {
            const userResponse = await apiClient.get('/api/users/profile');
            if (userResponse.data.success && userResponse.data.user) {
              setIsLoggedIn(true);
              setUserRole(userResponse.data.user.role);
              setUser({
                id: userResponse.data.user._id || userResponse.data.user.id,
                username: userResponse.data.user.username,
                email: userResponse.data.user.email
              });
            }
          } catch (profileError) {
            // Profile fetch failed, but user is authenticated
            // Try to get basic info from is-auth response if available
            console.warn('Profile fetch failed:', profileError.response?.status);
            setIsLoggedIn(false);
            setUserRole(null);
            setUser(null);
          }
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
          setUser(null);
        }
      } catch (error) {
        // Not authenticated or error - clear state
        setIsLoggedIn(false);
        setUserRole(null);
        setUser(null);
        // Only log non-401 errors (401 is expected when not logged in)
        if (error.response?.status !== 401) {
          console.warn('Auth check error:', error.response?.status || error.message);
        }
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  const formatDoctor = (doctor) => ({
    id: doctor?._id,
    userId: doctor?.user?._id || doctor?.user,
    name: doctor?.user?.username || "Doctor",
    email: doctor?.user?.email || "",
    specialty: doctor?.specialty || "General Physician",
    category: (doctor?.category || "general").toLowerCase(),
    experienceYears: doctor?.experienceYears ?? null,
    experience: doctor?.experienceYears ? `${doctor.experienceYears}+ yrs experience` : "Experience not set",
    location: doctor?.location || "Location not specified",
    img: doctor?.imageUrl || "/Pictures/doctor-dashboard.png",
    about: doctor?.about || "Doctor profile details will appear once updated.",
    appointmentFee: doctor?.appointmentFee ?? 0,
    contactNumber: doctor?.contactNumber || "",
    availability: doctor?.availability?.length ? doctor.availability : [],
  });

  const fetchDoctors = useCallback(async () => {
    setDoctorsLoading(true);
    setDoctorsError(null);
    try {
      const { data } = await apiClient.get('/api/users/doctors');
      const formattedDoctors = (data?.doctors || []).map(formatDoctor);
      setDoctors(formattedDoctors);
    } catch (error) {
      console.error("Fetch doctors error:", error);
      setDoctorsError(error.response?.data?.message || "Unable to load doctors right now.");
    } finally {
      setDoctorsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const value = {
    backendURL,
    IsLoggedIn,
    setIsLoggedIn,
    UserRole,
    setUserRole,
    User,
    setUser,
    doctors,
    doctorsLoading,
    doctorsError,
    authLoading,
    refreshDoctors: fetchDoctors,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
