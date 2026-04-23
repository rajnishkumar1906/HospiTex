import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Mail, Lock, MapPin, Activity, Stethoscope, ClipboardList, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Patient',
    gender: '',
    state: '',
    district: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupResult, setSignupResult] = useState(null);
  const { signup, backendError } = useApp();
  const navigate = useNavigate();

  const roles = [
    { value: 'Patient', label: 'Patient', icon: User, autoVerify: true },
    { value: 'Doctor', label: 'Doctor', icon: Stethoscope, autoVerify: false },
    { value: 'Diagnostic', label: 'Diagnostic', icon: ClipboardList, autoVerify: false },
    { value: 'Admin', label: 'Admin', icon: Shield, autoVerify: true }
  ];

  const genders = [
    { value: 'Male', label: 'Male', icon: '♂️' },
    { value: 'Female', label: 'Female', icon: '♀️' },
    { value: 'Other', label: 'Other', icon: '⚧' }
  ];

  const states = [
    'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 
    'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  const districts = {
  'Andhra Pradesh': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Kadapa', 'Krishna', 'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari'],
  'Bihar': ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali'],
  'Delhi': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
  'Gujarat': ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udepur', 'Dahod', 'Dangs', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kutch', 'Kheda', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'],
  'Karnataka': ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davangere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'],
  'Kerala': ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Ujjain', 'Gwalior', 'Sagar', 'Rewa', 'Satna', 'Chhatarpur', 'Damoh', 'Panna', 'Tikamgarh', 'Niwari', 'Shivpuri', 'Guna', 'Ashoknagar', 'Vidisha', 'Raisen', 'Sehore', 'Hoshangabad', 'Betul', 'Harda', 'Narmadapuram', 'Chhindwara', 'Seoni', 'Balaghat', 'Mandla', 'Dindori', 'Shahdol', 'Anuppur', 'Umaria', 'Katni', 'Narsinghpur'],
  'Maharashtra': ['Mumbai', 'Mumbai Suburban', 'Thane', 'Palghar', 'Raigad', 'Ratnagiri', 'Sindhudurg', 'Pune', 'Ahmednagar', 'Solapur', 'Satara', 'Sangli', 'Kolhapur', 'Nashik', 'Dhule', 'Nandurbar', 'Jalgaon', 'Buldhana', 'Akola', 'Washim', 'Amravati', 'Wardha', 'Nagpur', 'Bhandara', 'Gondia', 'Chandrapur', 'Gadchiroli', 'Yavatmal', 'Hingoli', 'Nanded', 'Parbhani', 'Jalna', 'Aurangabad', 'Beed', 'Latur', 'Osmanabad'],
  'Punjab': ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Nawanshahr', 'Pathankot', 'Patiala', 'Rupnagar', 'Sahibzada Ajit Singh Nagar', 'Sangrur', 'Shahid Bhagat Singh Nagar', 'Sri Muktsar Sahib', 'Tarn Taran'],
  'Rajasthan': ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam'],
  'Uttar Pradesh': ['Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Sant Ravidas Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'],
  'West Bengal': ['Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur']
};

  const selectedRole = roles.find(r => r.value === formData.role);
  const availableDistricts = districts[formData.state] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.state) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (formData.role !== 'Admin' && !formData.district) {
      toast.error('Please select district');
      return;
    }
    
    if (formData.role === 'Patient' && !formData.gender) {
      toast.error('Please select gender');
      return;
    }
    
    setLoading(true);
    setSignupResult(null);
    
    try {
      const result = await signup(formData);
      console.log('Signup result in component:', result);
      
      if (result && result.success) {
        const user = result.user;
        const autoVerify = user.role === 'Patient' || user.role === 'Admin';
        
        if (autoVerify) {
          toast.success('Account created successfully! 🎉');
          
          if (user.role === 'Patient') {
            setTimeout(() => {
              navigate('/patient');
            }, 500);
          } else if (user.role === 'Admin') {
            setTimeout(() => {
              navigate('/admin');
            }, 500);
          }
        } else {
          setSignupResult({
            success: true,
            message: `✓ Your ${user.role} account has been created successfully!\n\n⚠️ Please wait for admin verification. You will receive an email once your account is approved.\n\nYou can login after verification.`
          });
          // Clear form
          setFormData({
            username: '',
            email: '',
            password: '',
            role: 'Patient',
            gender: '',
            state: '',
            district: ''
          });
          setShowPassword(false);
        }
      } else {
        const errorMsg = result?.error || 'Signup failed. Please try again.';
        setSignupResult({
          success: false,
          message: errorMsg
        });
      }
    } catch (error) {
      console.error('Signup error in handleSubmit:', error);
      setSignupResult({
        success: false,
        message: error.message || 'Signup failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (roleValue) => {
    setFormData({ ...formData, role: roleValue, district: '' });
    setSignupResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-6">
          <Activity className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary-600">HospiTex</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        {backendError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Cannot connect to server. Please make sure backend is running on port 5000</span>
          </div>
        )}

        {signupResult && (
          <div className={`mb-4 p-4 rounded-lg whitespace-pre-line ${signupResult.success ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
            <div className="flex items-start gap-2">
              {signupResult.success ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
              <span className="text-sm">{signupResult.message}</span>
            </div>
            {signupResult.success && !selectedRole?.autoVerify && (
              <button
                onClick={() => navigate('/login')}
                className="mt-3 text-sm font-medium underline hover:no-underline"
              >
                Go to Login →
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                value={formData.username} 
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                className="input-field pl-10" 
                placeholder="Enter username"
                required 
                disabled={backendError || signupResult?.success}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="input-field pl-10" 
                placeholder="Enter email"
                required 
                disabled={backendError || signupResult?.success}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type={showPassword ? 'text' : 'password'}
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="input-field pl-10 pr-10" 
                placeholder="Min 6 characters"
                required 
                disabled={backendError || signupResult?.success}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(role => (
                <button 
                  key={role.value} 
                  type="button" 
                  onClick={() => handleRoleChange(role.value)} 
                  className={`p-3 rounded-lg border-2 transition-all duration-300 text-center ${formData.role === role.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-primary-300'}`}
                  disabled={backendError || signupResult?.success}
                >
                  <role.icon className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm font-medium">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {formData.role === 'Patient' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <div className="grid grid-cols-3 gap-2">
                {genders.map(gender => (
                  <button
                    key={gender.value}
                    type="button"
                    onClick={() => setFormData({...formData, gender: gender.value})}
                    className={`p-2 rounded-lg border-2 transition-all duration-300 text-center ${formData.gender === gender.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-primary-300'}`}
                  >
                    <span className="text-2xl mb-1 block">{gender.icon}</span>
                    <span className="text-sm">{gender.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select 
                value={formData.state} 
                onChange={(e) => setFormData({...formData, state: e.target.value, district: ''})} 
                className="input-field pl-10" 
                required
                disabled={backendError || signupResult?.success}
              >
                <option value="">Select State</option>
                {states.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
          </div>

          {formData.role !== 'Admin' && formData.state && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select 
                  value={formData.district} 
                  onChange={(e) => setFormData({...formData, district: e.target.value})} 
                  className="input-field pl-10" 
                  required
                  disabled={backendError || signupResult?.success}
                >
                  <option value="">Select District</option>
                  {availableDistricts.map(district => <option key={district} value={district}>{district}</option>)}
                </select>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || backendError || signupResult?.success} 
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Creating account...' : backendError ? 'Backend Offline' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;