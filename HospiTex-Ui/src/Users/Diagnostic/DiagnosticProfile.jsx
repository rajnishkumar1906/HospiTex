import React, { useState } from "react";
import { Microscope, Stethoscope, FlaskConical, MapPin } from "lucide-react";

const DiagnosticProfile = () => {

  // These will be populated via auth / API later
  const [profile, setProfile] = useState({
    labName: "",
    headName: "",
    established: "",
    location: "",
    contact: "",
    email: "",
    hours: "",
    accreditation: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // later you'll send this to API
    console.log("Diagnostic Profile Updated:", profile);

    setIsOpen(false);
  };

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
              {profile.labName || "Lab Name"}
            </h3>

            <p className="text-gray-600 mt-1">
              Head: {profile.headName || "—"}
            </p>

            <p className="text-gray-500 text-sm">
              Since {profile.established || "—"}
            </p>

            <img
              src="/Pictures/lab1.png"
              alt="Lab Facility"
              className="w-full rounded-xl shadow-md"
            />
          </div>

          {/* Right Side */}
          <div className="flex flex-col w-2/3 space-y-3">
            <p className="text-indigo-700 font-medium text-lg">
              Diagnostic Laboratory
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Location:</span>{" "}
              {profile.location || "—"}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Contact:</span>{" "}
              {profile.contact || "—"}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Email:</span>{" "}
              {profile.email || "—"}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Working Hours:</span>{" "}
              {profile.hours || "—"}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Accreditation:</span>{" "}
              {profile.accreditation || "—"}
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
              Edit Lab Profile
            </h2>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              
              <input
                type="text"
                name="labName"
                value={profile.labName}
                onChange={handleChange}
                placeholder="Lab Name"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="text"
                name="headName"
                value={profile.headName}
                onChange={handleChange}
                placeholder="Head / Incharge"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="text"
                name="established"
                value={profile.established}
                onChange={handleChange}
                placeholder="Established Year"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="Location"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="text"
                name="contact"
                value={profile.contact}
                onChange={handleChange}
                placeholder="Contact Number"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Email"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="text"
                name="hours"
                value={profile.hours}
                onChange={handleChange}
                placeholder="Working Hours"
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="text"
                name="accreditation"
                value={profile.accreditation}
                onChange={handleChange}
                placeholder="Accreditation"
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
