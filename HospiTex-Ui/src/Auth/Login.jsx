import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const API_URL = "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();
  const { IsLoggedIn, setIsLoggedIn, UserRole, setUserRole, setUser } = useContext(AppContext);

  const [userState, setUserState] = useState('Login'); // Login or SignUp
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedType, setSelectedType] = useState('Select');

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

    if (!name || !email || !password) return toast.error("All fields are required");
    if (selectedType === "Select") return toast.error("Please select a user type");

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        username: name, // match backend
        email,
        password,
        role: selectedType,
      });

      // ✅ Use returned user and role if backend is fixed
      const user = response.data.user || { username: name, role: selectedType };
      const role = response.data.role || selectedType;

      setIsLoggedIn(true);
      setUserRole(role);
      setUser(user);

      toast.success("SignUp successful!",);

      // Navigate
      if (role === 'Patient') navigate('/patient-dashboard');
      else if (role === 'Doctor') navigate('/doctor-dashboard');
      else if (role === 'Diagnostic') navigate('/diagnostic-dashboard');

    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) return toast.error("All fields are required");

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });

      const user = response.data.user;
      const role = response.data.role;

      if (!user || !role) return toast.error("Login failed");

      setIsLoggedIn(true);
      setUserRole(role);
      setUser(user);

      toast.success("Login successful");

      if (role === 'Patient') navigate('/patient-dashboard');
      else if (role === 'Doctor') navigate('/doctor-dashboard');
      else if (role === 'Diagnostic') navigate('/diagnostic-dashboard');

    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-300 via-green-300 to-indigo-300 p-4">
      
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-6">HospiTex</h1>

        <form className="w-full flex flex-col gap-4" onSubmit={userState === 'SignUp' ? handleSignUp : handleLogin}>
          {userState === 'SignUp' && (
            <>
              <input type="text" placeholder="Name" className="p-3 rounded-lg border border-gray-300" value={name} onChange={e => setName(e.target.value)} />
              <input type="email" placeholder="Email" className="p-3 rounded-lg border border-gray-300" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" className="p-3 rounded-lg border border-gray-300" value={password} onChange={e => setPassword(e.target.value)} />
              <select className="p-3 rounded-lg border border-gray-300" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                <option value="Select">Select</option>
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Diagnostic">Diagnostic</option>
              </select>
            </>
          )}

          {userState === 'Login' && (
            <>
              <input type="email" placeholder="Email" className="p-3 rounded-lg border border-gray-300" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" className="p-3 rounded-lg border border-gray-300" value={password} onChange={e => setPassword(e.target.value)} />
            </>
          )}

          <button type="submit" className="bg-blue-600 text-white py-3 rounded-lg mt-2 hover:bg-blue-700 transition cursor-pointer">
            {userState === 'SignUp' ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-gray-500 text-sm">
          {userState === 'SignUp' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => setUserState(userState === 'SignUp' ? 'Login' : 'SignUp')}>
            {userState === 'SignUp' ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
