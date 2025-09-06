import React, { useState } from "react";
import { Microscope, Stethoscope, FlaskConical, MapPin } from "lucide-react";

const DiagnosticProfile = () => {
  const labName = "Apollo Diagnostic Lab";
  const headName = "Dr. Anjali Sharma";
  const established = "2005";
  const location = "Connaught Place, New Delhi";
  const contact = "+91 9876543210";
  const email = "info@mediscan.com";
  const hours = "Mon - Sun: 7 AM - 9 PM";
  const accreditation = "NABL Accredited";

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-100 via-indigo-100 to-white">
      {/* Main Content */}
      <main className="flex-grow flex justify-center items-center p-6">
        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-6xl flex gap-8 items-start">
          {/* Left Side */}
          <div className="flex flex-col items-center w-1/3 space-y-4">
            <img
              src="/Pictures/lab.png"
              alt="Lab Logo"
              className="w-28 h-28 rounded-full border-4 border-indigo-600 bg-gray-100"
            />
            <h3 className="text-2xl font-semibold mt-2 text-gray-800">
              {labName}
            </h3>
            <p className="text-gray-600 mt-1">Head: {headName}</p>
            <p className="text-gray-500 text-sm">Since {established}</p>
            <img
              src="/Pictures/lab1.png"
              alt="Lab Facility"
              className="w-full rounded-xl shadow-md"
            />
          </div>

          {/* Right Side */}
          <div className="flex flex-col w-2/3 space-y-4">
            <p className="text-indigo-700 font-medium text-lg">
              Diagnostic Laboratory
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Location:</span> {location}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Contact:</span> {contact}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {email}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Working Hours:</span> {hours}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Accreditation:</span>{" "}
              {accreditation}
            </p>

            {/* Services Section */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-xl shadow-sm">
                <Microscope className="text-indigo-600" />
                <p className="text-gray-700">Pathology Tests</p>
              </div>
              <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-xl shadow-sm">
                <Stethoscope className="text-indigo-600" />
                <p className="text-gray-700">Health Checkups</p>
              </div>
              <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-xl shadow-sm">
                <FlaskConical className="text-indigo-600" />
                <p className="text-gray-700">Biochemistry Labs</p>
              </div>
              <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-xl shadow-sm">
                <MapPin className="text-indigo-600" />
                <p className="text-gray-700">Home Sample Pickup</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="mt-6 self-start bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-700 text-white py-6 mt-10 w-full">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">HospiTex</h2>
            <p className="text-sm text-indigo-200">Trusted Diagnostics Partner</p>
          </div>

          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="/" className="hover:text-indigo-300">Home</a>
            <a href="/about" className="hover:text-indigo-300">About</a>
            <a href="/contact" className="hover:text-indigo-300">Contact</a>
          </div>

          <div className="text-sm text-indigo-200">
            © {new Date().getFullYear()} HospiTex. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Popup Modal */}
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
              Edit Lab Profile
            </h2>

            <form className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Lab Name"
                defaultValue={labName}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Head/Incharge"
                defaultValue={headName}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Established Year"
                defaultValue={established}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Location"
                defaultValue={location}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Contact"
                defaultValue={contact}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                placeholder="Email"
                defaultValue={email}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Working Hours"
                defaultValue={hours}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Accreditation"
                defaultValue={accreditation}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
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

export default DiagnosticProfile;
