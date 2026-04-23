import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, Lock, Eye, EyeOff, Activity, AlertCircle, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(null);
  const { login, backendError, user } = useApp();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      redirectBasedOnRole(user.role);
    }
  }, [user]);

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case 'Patient':
        navigate('/patient');
        break;
      case 'Doctor':
        navigate('/doctor');
        break;
      case 'Diagnostic':
        navigate('/diagnostic');
        break;
      case 'Admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setWarning(null);
    
    const result = await login(email, password);
    
    setLoading(false);
    
    if (result && result.success && result.user) {
      // Show warning if account not verified
      if (result.warning) {
        setWarning(result.warning);
        toast.warning(result.warning, { duration: 5000 });
      }
      
      // Redirect after short delay to show warning
      setTimeout(() => {
        redirectBasedOnRole(result.user.role);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <Activity className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary-600">HospiTex</h1>
          <p className="text-gray-600 mt-2">Welcome back! Please login to your account</p>
        </div>

        {/* Backend Error Alert */}
        {backendError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Cannot connect to server. Please make sure backend is running on port 5000</span>
          </div>
        )}

        {/* Verification Warning */}
        {warning && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg flex items-start gap-2">
            <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Account Pending Verification</p>
              <p className="text-xs mt-1">{warning}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="input-field pl-10" 
                placeholder="Enter your email" 
                required 
                disabled={backendError}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="input-field pl-10 pr-10" 
                placeholder="Enter your password" 
                required 
                disabled={backendError}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading || backendError} 
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Logging in...' : backendError ? 'Backend Offline' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account? <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;