import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Auth/AppContext";
import apiClient from "../../config/axios";

const DoctorProfile = () => {
  const { User } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: User?.username || "",
    specialty: "",
    about: "",
    location: "",
    appointmentFee: "",
    contactNumber: "",
    availability: "",
    experienceYears: "",
    imageUrl: "",
  });

  const [rating] = useState("4.8 ★");
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
      if (formData.name && formData.name !== User?.username) {
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
      setIsOpen(false);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to update profile.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow flex justify-center mt-10">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl flex gap-6 items-start">
          {/* Left Side */}
          <div className="flex flex-col items-center w-1/3">
            <img
              src={formData.imageUrl || "/Pictures/doctor-dashboard.png"}
              alt="Doctor"
              className="w-32 h-32 rounded-full border-4 border-green-600 object-cover"
            />
            <h3 className="text-xl font-semibold mt-3 text-gray-800">
              {formData.name || "Add your name"}
            </h3>
            <p className="text-yellow-500 font-medium mt-1">{rating}</p>
            <p className="text-gray-600">
              Experience: {formData.experienceYears ? `${formData.experienceYears} yrs` : "Add experience"}
            </p>
          </div>

          {/* Right Side */}
          <div className="flex flex-col w-2/3">
            <p className="text-green-700 font-medium text-lg">
              {formData.specialty || "Add specialization"}
            </p>
            <p className="text-gray-600 mt-2">{formData.about || "Tell patients more about your practice, treatment philosophy, and focus areas."}</p>

            <p className="text-gray-700 mt-3">
              <span className="font-semibold">Location:</span>{" "}
              {formData.location || "Not provided"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Appointment Fee:</span>{" "}
              {formData.appointmentFee ? `₹${formData.appointmentFee}` : "Set a fee"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Contact:</span> {formData.contactNumber || "Add a contact number"}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Availability:</span>{" "}
              {formData.availability || "Set available slots"}
            </p>

            {error && <p className="text-red-600 mt-4">{error}</p>}
            {success && <p className="text-green-600 mt-4">{success}</p>}

            <button
              onClick={() => setIsOpen(true)}
              className="mt-5 self-start bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-6 mt-10 w-full">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">HospiTex</h2>
            <p className="text-sm text-green-200">
              Caring for your health, always.
            </p>
          </div>
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="/" className="hover:text-green-300">Home</a>
            <a href="/about" className="hover:text-green-300">About</a>
            <a href="/contact" className="hover:text-green-300">Contact</a>
          </div>
          <div className="text-sm text-green-200">
            © {new Date().getFullYear()} HospiTex. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-xl shadow-xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Edit Doctor Profile
            </h2>

            <form onSubmit={updateUser} className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Specialization"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="About Doctor"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                name="appointmentFee"
                value={formData.appointmentFee}
                onChange={handleChange}
                placeholder="Appointment Fee"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Contact Number"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                placeholder="Experience (years)"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                placeholder="Available slots (comma separated)"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Profile Image URL"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              />

              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
