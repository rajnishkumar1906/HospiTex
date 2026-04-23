import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, User, Calendar, FileText } from 'lucide-react';

const DoctorPatients = () => {
  const { api } = useApp();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/appointments/doctor/all');
      if (response.data.success) {
        // Extract unique patients from appointments
        const uniquePatients = {};
        response.data.data.forEach(apt => {
          if (apt.patient && !uniquePatients[apt.patient._id]) {
            uniquePatients[apt.patient._id] = apt.patient;
          }
        });
        setPatients(Object.values(uniquePatients));
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Patients</h2>
      
      {patients.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No patients yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {patients.map((patient) => (
            <div key={patient._id} className="card flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{patient.username}</h3>
                  <p className="text-sm text-gray-500">{patient.email}</p>
                </div>
              </div>
              <button className="text-primary-600 hover:text-primary-700 text-sm">View History</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;