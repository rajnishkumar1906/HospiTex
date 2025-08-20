import React from "react";

const DiagnosticProfile = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-white px-6 py-24">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">
          Diagnostic Center Profile
        </h1>

        {/* Profile Info */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Center Name</h2>
            <p className="text-gray-600">ABC Diagnostics</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">Email</h2>
            <p className="text-gray-600">contact@abcdiagnostics.com</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">Phone</h2>
            <p className="text-gray-600">+91 9876543210</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">Address</h2>
            <p className="text-gray-600">
              123 Health Street, Medical City, India
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">Services</h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Blood Test</li>
              <li>X-Ray & MRI</li>
              <li>CT Scan</li>
              <li>Health Packages</li>
            </ul>
          </div>
        </div>

        {/* Edit Button (Future) */}
        <div className="mt-8">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Edit Profile
          </button>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticProfile;
