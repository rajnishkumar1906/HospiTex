import React, { createContext, useState, useContext } from 'react';

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);

  const registerPatient = (patient) => {
    setPatients((prev) => [...prev, patient]);
  };

  return (
    <PatientContext.Provider value={{ patients, registerPatient }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatientContext = () => useContext(PatientContext);