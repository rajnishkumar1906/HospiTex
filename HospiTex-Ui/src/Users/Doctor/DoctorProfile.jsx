import React, { useContext, useState } from "react";
import { AppContext } from "../../Auth/AppContext";

const DoctorProfile = () => {
  const { User, backendUrl } = useContext(AppContext);

  // Form state
  const [formData, setFormData] = useState({
    name: User?.username || "Dr. Unknown",
    specialization: "Gynecologist",
    about:
      "Dr. Smith has over 12 years of experience in gynecology, specializing in prenatal care, reproductive health, and advanced treatments. She is passionate about providing compassionate and personalized healthcare.",
    location: "Apollo Hospital, New Delhi",
    appointmentFee: "₹800",
    contact: "+91 9876543210",
    hours: "Mon - Sat: 9 AM - 6 PM",
  });

  const experience = "12+ years";
  const rating = "4.8 ★";

  const [isOpen, setIsOpen] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save/update user
  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/doctor/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        setIsOpen(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow flex justify-center mt-10">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl flex gap-6 items-start">
          {/* Left Side */}
          <div className="flex flex-col items-center w-1/3">
            <img
              src="https://randomuser.me/api/portraits/men/1.jpg"
              alt="Doctor"
              className="w-32 h-32 rounded-full border-4 border-green-600"
            />
            <h3 className="text-xl font-semibold mt-3 text-gray-800">
              {formData.name}
            </h3>
            <p className="text-yellow-500 font-medium mt-1">{rating}</p>
            <p className="text-gray-600">Experience: {experience}</p>
          </div>

          {/* Right Side */}
          <div className="flex flex-col w-2/3">
            <p className="text-green-700 font-medium text-lg">
              {formData.specialization}
            </p>
            <p className="text-gray-600 mt-2">{formData.about}</p>

            <p className="text-gray-700 mt-3">
              <span className="font-semibold">Location:</span>{" "}
              {formData.location}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Appointment Fee:</span>{" "}
              {formData.appointmentFee}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Contact:</span> {formData.contact}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Working Hours:</span>{" "}
              {formData.hours}
            </p>

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
                name="specialization"
                value={formData.specialization}
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
                type="text"
                name="appointmentFee"
                value={formData.appointmentFee}
                onChange={handleChange}
                placeholder="Appointment Fee"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Contact"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                placeholder="Working Hours"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              />

              <button
                type="submit"
                className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
