import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const {
    userState,
    setUserState,
    isLoggedIn,
    setIsLoggedIn,
    userType,
    setUserType,
    users,
    setUsers,
    setCurrentUser
  } = useContext(AppContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedType, setSelectedType] = useState('Select');

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoggedIn) return;

    if (userType === 'Patient') navigate('/patient-dashboard');
    else if (userType === 'Doctor') navigate('/doctor-dashboard');
    else if (userType === 'Diagnostic') navigate('/diagnostic-dashboard');
  }, [isLoggedIn, userType, navigate]);

  const handleSignUp = (e) => {
    e.preventDefault();

    if (!name || !email || !password) return toast.error("All fields are required");
    if (selectedType === "Select") return toast.error("Please select a user type");

    const existingUser = users.find(u => u.email === email);
    if (existingUser) return toast.error("User already exists");

    const newUser = { name, email, password, type: selectedType };
    setUsers([...users, newUser]);
    setIsLoggedIn(true);
    setUserType(selectedType);
    setCurrentUser(newUser);
    toast.success("SignUp successful");

    // reset form
    setName('');
    setEmail('');
    setPassword('');
    setSelectedType('Select');

    // redirect
    if (selectedType === 'Patient') navigate('/patient-dashboard');
    else if (selectedType === 'Doctor') navigate('/doctor-dashboard');
    else if (selectedType === 'Diagnostic') navigate('/diagnostic-dashboard');
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return toast.error("Invalid credentials");

    setIsLoggedIn(true);
    setUserType(user.type);
    setCurrentUser(user);
    toast.success("Login successful");

    // reset form
    setEmail('');
    setPassword('');

    if (user.type === 'Patient') navigate('/patient-dashboard');
    else if (user.type === 'Doctor') navigate('/doctor-dashboard');
    else if (user.type === 'Diagnostic') navigate('/diagnostic-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-300 via-green-300 to-indigo-300  p-4">
      <ToastContainer />
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-6">HospiTex</h1>

        <form className="w-full flex flex-col gap-4">
          {userState === 'SignUp' && (
            <>
              <input
                type="text"
                placeholder="Name"
                className="p-3 rounded-lg border border-gray-300"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="p-3 rounded-lg border border-gray-300"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="p-3 rounded-lg border border-gray-300"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <select
                className="p-3 rounded-lg border border-gray-300"
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
              >
                <option>Select</option>
                <option>Patient</option>
                <option>Doctor</option>
                <option>Diagnostic</option>
              </select>
              <button
                onClick={handleSignUp}
                className="bg-blue-600 text-white py-3 rounded-lg mt-2 hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </>
          )}

          {userState === 'Login' && (
            <>
              <input
                type="email"
                placeholder="Email"
                className="p-3 rounded-lg border border-gray-300"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="p-3 rounded-lg border border-gray-300"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                onClick={handleLogin}
                className="bg-blue-600 text-white py-3 rounded-lg mt-2 hover:bg-blue-700 transition"
              >
                Login
              </button>
            </>
          )}
        </form>

        {/* Toggle SignUp/Login */}
        <p className="mt-4 text-gray-500 text-sm">
          {userState === 'SignUp' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            className="text-blue-600 font-semibold cursor-pointer"
            onClick={() => setUserState(userState === 'SignUp' ? 'Login' : 'SignUp')}
          >
            {userState === 'SignUp' ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
