import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Auth/AppContext";
import apiClient from "../../config/axios";

const PatientProfile = () => {
  const { User } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    emergencyContact: "",
    medicalHistory: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/api/users/profile");
        const patientProfile = data?.profile;
        setProfile({
          name: data?.user?.username || "",
          age: patientProfile?.age?.toString() || "",
          gender: patientProfile?.gender || "",
          phone: patientProfile?.phone || "",
          email: data?.user?.email || "",
          address: patientProfile?.address || "",
          bloodGroup: patientProfile?.bloodGroup || "",
          emergencyContact: patientProfile?.emergencyContact || "",
          medicalHistory: patientProfile?.medicalHistory || "",
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
    setProfile((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (profile.name && profile.name !== User?.username) {
        await apiClient.put("/api/users/profile", { username: profile.name });
      }

      const payload = {
        phone: profile.phone,
        age: profile.age ? Number(profile.age) : null,
        gender: profile.gender,
        address: profile.address,
        bloodGroup: profile.bloodGroup,
        emergencyContact: profile.emergencyContact,
        medicalHistory: profile.medicalHistory,
      };

      await apiClient.put("/api/users/profile/patient", payload);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-white">
        <p className="text-white text-lg">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500 to-white">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        {/* Profile Card */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl flex gap-8 items-start">
          {/* Left Side */}
          <div className="flex flex-col items-center w-1/3">
            <img
              src="/Pictures/patient.png"
              alt="Patient"
              className="w-32 h-32 rounded-full border-4 border-blue-600 object-cover"
            />
            <h3 className="text-xl font-semibold mt-4 text-gray-800">{profile.name || "Add your name"}</h3>
            <p className="text-gray-600">
              {profile.gender || "Gender"}, {profile.age || "--"} years
            </p>
          </div>

          {/* Right Side */}
          <div className="flex flex-col w-2/3 space-y-3">
            <p>
              <span className="font-semibold">Phone:</span> {profile.phone || "Add a phone number"}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {profile.email || "Add an email"}
            </p>
            <p>
              <span className="font-semibold">Address:</span> {profile.address || "Add an address"}
            </p>
            <p>
              <span className="font-semibold">Blood Group:</span> {profile.bloodGroup || "Add blood group"}
            </p>
            <p>
              <span className="font-semibold">Emergency Contact:</span>{" "}
              {profile.emergencyContact || "Add emergency contact"}
            </p>
            <p>
              <span className="font-semibold">Medical History:</span>{" "}
              {profile.medicalHistory || "Share allergies, chronic conditions, or prior surgeries to help doctors prepare."}
            </p>

            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <button
              onClick={() => setIsOpen(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-6 text-center">
        <p className="font-semibold text-lg">HospiTex</p>
        <p className="text-sm text-blue-200">
          © {new Date().getFullYear()} HospiTex. All rights reserved.
        </p>
      </footer>

      {/* Edit Profile Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Edit Patient Profile</h2>
            <form className="flex flex-col gap-3" onSubmit={updateProfile}>
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Age"
                name="age"
                value={profile.age}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Gender"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email (managed during login)"
                name="email"
                value={profile.email}
                readOnly
                className="border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
              <input
                type="text"
                placeholder="Address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Blood Group"
                name="bloodGroup"
                value={profile.bloodGroup}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Emergency Contact"
                name="emergencyContact"
                value={profile.emergencyContact}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
              <textarea
                placeholder="Medical History"
                name="medicalHistory"
                value={profile.medicalHistory}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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

export default PatientProfile;
