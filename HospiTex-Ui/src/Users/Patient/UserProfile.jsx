import React from 'react';
import { usePatientContext } from '/src/context/PatientContext';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { patients } = usePatientContext();
  const navigate = useNavigate();

  if (patients.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-700">No patient data found. Please register first.</p>
        <button
          onClick={() => navigate('/patient-dashboard/patientReg')}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Go to Registration
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Registered Patients</h2>
      {patients.map((patient, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-6"
        >
          <h3 className="text-xl font-semibold mb-2">{patient.fullName}</h3>
          <ul className="text-gray-700 space-y-1">
            <li><strong>Age:</strong> {patient.age}</li>
            <li><strong>Gender:</strong> {patient.gender}</li>
            <li><strong>Phone:</strong> {patient.phone}</li>
            <li><strong>Email:</strong> {patient.email || 'N/A'}</li>
            <li><strong>Address:</strong> {patient.address}</li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default UserProfile;