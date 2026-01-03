import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Auth/AppContext";
import apiClient from "../../config/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  MapPin, 
  Phone, 
  DollarSign, 
  Clock, 
  Award, 
  Edit2, 
  X, 
  Star,
  Briefcase,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Save,
  Loader
} from "lucide-react";
import DoctorNavbar from "./DoctorNavbar";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { User: ContextUser } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: ContextUser?.username || "",
    specialty: "",
    about: "",
    location: "",
    appointmentFee: "",
    contactNumber: "",
    availability: "",
    experienceYears: "",
    imageUrl: "",
  });

  const [rating] = useState(4.8);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/api/users/profile");
        const profile = data?.profile;
        setFormData({
          name: data?.user?.username || "",
          specialty: profile?.specialty || "",
          about: profile?.about || "",
          location: profile?.location || "",
          appointmentFee: profile?.appointmentFee?.toString() || "",
          contactNumber: profile?.contactNumber || "",
          availability: profile?.availability?.join(", ") || "",
          experienceYears: profile?.experienceYears?.toString() || "",
          imageUrl: profile?.imageUrl || "",
        });
      } catch (err) {
        const message = err.response?.data?.message || "Unable to load your profile.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(null);
    setError(null);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      if (formData.name && formData.name !== ContextUser?.username) {
        await apiClient.put("/api/users/profile", { username: formData.name });
      }

      const payload = {
        specialty: formData.specialty,
        about: formData.about,
        location: formData.location,
        appointmentFee: Number(formData.appointmentFee) || 0,
        contactNumber: formData.contactNumber,
        experienceYears: Number(formData.experienceYears) || 0,
        imageUrl: formData.imageUrl,
        availability: formData.availability
          ? formData.availability.split(",").map((slot) => slot.trim()).filter(Boolean)
          : [],
      };

      await apiClient.put("/api/users/profile/doctor", payload);
      setSuccess("Profile updated successfully!");
      toast.success("Profile updated successfully!");
      setIsOpen(false);
      
      // Refresh profile data
      const { data } = await apiClient.get("/api/users/profile");
      const profile = data?.profile;
      setFormData({
        name: data?.user?.username || "",
        specialty: profile?.specialty || "",
        about: profile?.about || "",
        location: profile?.location || "",
        appointmentFee: profile?.appointmentFee?.toString() || "",
        contactNumber: profile?.contactNumber || "",
        availability: profile?.availability?.join(", ") || "",
        experienceYears: profile?.experienceYears?.toString() || "",
        imageUrl: profile?.imageUrl || "",
      });
    } catch (err) {
      const message = err.response?.data?.message || "Unable to update profile.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 overflow-hidden">
        <DoctorNavbar />
        <div className="flex-1 flex items-center justify-center overflow-y-auto">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const infoItems = [
    {
      icon: Stethoscope,
      label: "Specialization",
      value: formData.specialty || "Not specified",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: MapPin,
      label: "Location",
      value: formData.location || "Not provided",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: DollarSign,
      label: "Appointment Fee",
      value: formData.appointmentFee ? `₹${formData.appointmentFee}` : "Not set",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Phone,
      label: "Contact",
      value: formData.contactNumber || "Not provided",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Briefcase,
      label: "Experience",
      value: formData.experienceYears ? `${formData.experienceYears} years` : "Not specified",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: Clock,
      label: "Availability",
      value: formData.availability || "Not set",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 overflow-hidden">
      <DoctorNavbar />
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your professional information and settings</p>
          </motion.div>

          {/* Main Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          >
            {/* Profile Header with Gradient */}
            <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 px-8 py-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <div className="absolute -inset-2 bg-white rounded-full"></div>
                  <img
                    src={formData.imageUrl || "/Pictures/doctor-dashboard.png"}
                    alt="Doctor"
                    className="w-32 h-32 rounded-full border-4 border-white object-cover relative z-10 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                </div>

                {/* Name and Rating */}
                <div className="flex-1 text-center md:text-left text-white">
                  <h2 className="text-3xl font-bold mb-2">{formData.name || "Your Name"}</h2>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-semibold">{rating}</span>
                    </div>
                    <span className="text-white/80">Rating</span>
                  </div>
                  <p className="text-white/90 text-lg">{formData.specialty || "Add your specialization"}</p>
                </div>

                {/* Edit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(true)}
                  className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </motion.button>
              </div>
            </div>

            {/* About Section */}
            {formData.about && (
              <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  About
                </h3>
                <p className="text-gray-600 leading-relaxed">{formData.about}</p>
              </div>
            )}

            {/* Info Grid */}
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {infoItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                      className={`${item.bgColor} rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`${item.color} p-2 rounded-lg bg-white`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500 font-medium mb-1">{item.label}</p>
                          <p className="text-gray-800 font-semibold break-words">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Success/Error Messages */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3 mb-4"
              >
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>{success}</span>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center gap-3 mb-4"
              >
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Edit2 className="w-6 h-6" />
                    Edit Profile
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={updateUser} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Specialization
                      </label>
                      <input
                        type="text"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleChange}
                        placeholder="e.g., Cardiologist"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        placeholder="Years of experience"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Appointment Fee (₹)
                      </label>
                      <input
                        type="number"
                        name="appointmentFee"
                        value={formData.appointmentFee}
                        onChange={handleChange}
                        placeholder="Fee amount"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder="Phone number"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Clinic/Hospital location"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      About
                    </label>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleChange}
                      placeholder="Tell patients about your practice, expertise, and approach..."
                      rows="4"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Availability (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      placeholder="e.g., Mon-Fri: 9AM-5PM, Sat: 10AM-2PM"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Profile Image URL
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Modal Footer */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsOpen(false)}
                      className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={saving}
                      whileHover={{ scale: saving ? 1 : 1.02 }}
                      whileTap={{ scale: saving ? 1 : 0.98 }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorProfile;
