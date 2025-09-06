import React, { useState } from "react";

const PatientProfile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const name = "Rajnish";
  const age = 22;
  const gender = "M";
  const phone = "+91 9876543210";
  const email = "rajnish@example.com";
  const address = "123 Blue Street, New Delhi";
  const bloodGroup = "O+";
  const emergencyContact = "+91 9123456789";
  const medicalHistory =
    "No major illnesses. Allergic to penicillin. History of seasonal flu.";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500  to-white">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        {/* Profile Card */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl flex gap-8 items-start">
          {/* Left Side */}
          <div className="flex flex-col items-center w-1/3">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Patient"
              className="w-32 h-32 rounded-full border-4 border-blue-600"
            />
            <h3 className="text-xl font-semibold mt-4 text-gray-800">{name}</h3>
            <p className="text-gray-600">
              {gender === "M" ? "Male" : "Female"}, {age} years
            </p>
          </div>

          {/* Right Side */}
          <div className="flex flex-col w-2/3 space-y-2">
            <p>
              <span className="font-semibold">Phone:</span> {phone}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {email}
            </p>
            <p>
              <span className="font-semibold">Address:</span> {address}
            </p>
            <p>
              <span className="font-semibold">Blood Group:</span> {bloodGroup}
            </p>
            <p>
              <span className="font-semibold">Emergency Contact:</span>{" "}
              {emergencyContact}
            </p>
            <p>
              <span className="font-semibold">Medical History:</span>{" "}
              {medicalHistory}
            </p>

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
            <form className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Full Name"
                defaultValue={name}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Age"
                defaultValue={age}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Gender"
                defaultValue={gender}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Phone"
                defaultValue={phone}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                defaultValue={email}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Address"
                defaultValue={address}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Blood Group"
                defaultValue={bloodGroup}
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder="Emergency Contact"
                defaultValue={emergencyContact}
                className="border rounded-lg px-3 py-2"
              />
              <textarea
                placeholder="Medical History"
                defaultValue={medicalHistory}
                className="border rounded-lg px-3 py-2"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
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

export default PatientProfile;
