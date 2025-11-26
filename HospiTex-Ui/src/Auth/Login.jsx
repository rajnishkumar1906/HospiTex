import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../config/axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();
  const { IsLoggedIn, setIsLoggedIn, UserRole, setUserRole, setUser } = useContext(AppContext);

  const [userState, setUserState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedType, setSelectedType] = useState('Select');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!IsLoggedIn) return;

    if (UserRole === 'Patient') navigate('/patient-dashboard');
    else if (UserRole === 'Doctor') navigate('/doctor-dashboard');
    else if (UserRole === 'Diagnostic') navigate('/diagnostic-dashboard');
  }, [IsLoggedIn, UserRole, navigate]);

  // Handle SignUp
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !password) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }
    if (selectedType === "Select") {
      toast.error("Please select a user type");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/auth/signup', {
        username: name,
        email,
        password,
        role: selectedType,
      });

      const user = response.data.user || { username: name, role: selectedType };
      const role = response.data.role || selectedType;

      setIsLoggedIn(true);
      setUserRole(role);
      setUser(user);

      toast.success("Welcome to HospiTex! Account created successfully.");

      if (role === 'Patient') navigate('/patient-dashboard');
      else if (role === 'Doctor') navigate('/doctor-dashboard');
      else if (role === 'Diagnostic') navigate('/diagnostic-dashboard');

    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/auth/login', { email, password });

      const user = response.data.user;
      const role = response.data.role;

      if (!user || !role) {
        toast.error("Login failed");
        setIsLoading(false);
        return;
      }

      setIsLoggedIn(true);
      setUserRole(role);
      setUser(user);

      toast.success(`Welcome back, ${user.username || 'User'}!`);

      if (role === 'Patient') navigate('/patient-dashboard');
      else if (role === 'Doctor') navigate('/doctor-dashboard');
      else if (role === 'Diagnostic') navigate('/diagnostic-dashboard');

    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      x: -30,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 p-4 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HospiTex
              </h1>
            </div>
            <p className="text-gray-600 text-sm">
              Your trusted healthcare companion
            </p>
          </motion.div>

          {/* Toggle Switch */}
          <motion.div
            variants={itemVariants}
            className="flex bg-gray-100 rounded-2xl p-1 mb-8"
          >
            <button
              onClick={() => setUserState('Login')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                userState === 'Login'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setUserState('SignUp')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                userState === 'SignUp'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.form
              key={userState}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
              onSubmit={userState === 'SignUp' ? handleSignUp : handleLogin}
            >
              {userState === 'SignUp' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <select
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none"
                      value={selectedType}
                      onChange={e => setSelectedType(e.target.value)}
                    >
                      <option value="Select">Select User Type</option>
                      <option value="Patient">Patient</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Diagnostic">Diagnostic</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              )}

              {userState === 'Login' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}

              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {userState === 'SignUp' ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    {userState === 'SignUp' ? 'Create Account' : 'Sign In'}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          <motion.div
            variants={itemVariants}
            className="text-center mt-6"
          >
            <p className="text-gray-600 text-sm">
              {userState === 'SignUp' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300"
                onClick={() => setUserState(userState === 'SignUp' ? 'Login' : 'SignUp')}
              >
                {userState === 'SignUp' ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-6"
        >
          <p className="text-white/80 text-sm">
            Secure access to your healthcare dashboard
          </p>
        </motion.div>
      </motion.div>

      
    </div>
  );
};

export default Login;