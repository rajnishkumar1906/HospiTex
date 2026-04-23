import React, { useState, useEffect } from 'react';
import { FileText, Clock, User, Stethoscope } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PatientPrescriptions = () => {
  const { api } = useApp();
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get('/prescriptions/patient/all');
      if (response.data.success) {
        setPrescriptions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Prescriptions</h2>
      
      {prescriptions.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No prescriptions found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((pres) => (
            <div key={pres._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary-500" />
                  <span className="font-medium">Dr. {pres.doctor?.username}</span>
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(pres.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {pres.diagnosis && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Diagnosis:</p>
                  <p className="text-sm text-gray-600">{pres.diagnosis}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Medications:</p>
                <div className="space-y-2">
                  {pres.medications.map((med, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-gray-600">Dosage: {med.dosage} | Frequency: {med.frequency} | Duration: {med.duration}</p>
                      {med.instructions && <p className="text-sm text-gray-500 mt-1">Instructions: {med.instructions}</p>}
                    </div>
                  ))}
                </div>
              </div>
              
              {pres.notes && (
                <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">{pres.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
