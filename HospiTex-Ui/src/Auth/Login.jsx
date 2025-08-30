import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const { IsLoggedIn, setIsLoggedIn, UserRole, setUserRole, setUser } = useContext(AppContext);

  const [userState, setUserState] = useState('Login'); // Login or SignUp
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedType, setSelectedType] = useState('Select');

  const [users, setUsers] = useState([]); // Temporary users storage

  // Redirect if already logged in
  useEffect(() => {
    if (!IsLoggedIn) return;

    if (UserRole === 'Patient') navigate('/patient-dashboard');
    else if (UserRole === 'Doctor') navigate('/doctor-dashboard');
    else if (UserRole === 'Diagnostic') navigate('/diagnostic-dashboard');
  }, [IsLoggedIn, UserRole, navigate]);

  // SignUp handler
  const handleSignUp = (e) => {
    e.preventDefault();

    if (!name || !email || !password) return toast.error("All fields are required");
    if (selectedType === "Select") return toast.error("Please select a user type");

    const existingUser = users.find(u => u.email === email);
    if (existingUser) return toast.error("User already exists");

    const newUser = { name, email, password, type: selectedType };
    setUsers([...users, newUser]);
    setIsLoggedIn(true);
    setUserRole(selectedType);
    setUser(newUser); // Update context user
    toast.success("SignUp successful");

    // Reset form
    setName('');
    setEmail('');
    setPassword('');
    setSelectedType('Select');

    // Redirect
    if (selectedType === 'Patient') navigate('/patient-dashboard');
    else if (selectedType === 'Doctor') navigate('/doctor-dashboard');
    else if (selectedType === 'Diagnostic') navigate('/diagnostic-dashboard');
  };

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return toast.error("Invalid credentials");

    setIsLoggedIn(true);
    setUserRole(user.type);
    setUser(user); // Update context user
    toast.success("Login successful");

    setEmail('');
    setPassword('');

    if (user.type === 'Patient') navigate('/patient-dashboard');
    else if (user.type === 'Doctor') navigate('/doctor-dashboard');
    else if (user.type === 'Diagnostic') navigate('/diagnostic-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-300 via-green-300 to-indigo-300 p-4">
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
                <option value="Select">Select</option>
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Diagnostic">Diagnostic</option>
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
