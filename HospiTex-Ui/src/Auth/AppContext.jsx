import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendURL = "http://localhost:5000"

  const [IsLoggedIn, setIsLoggedIn] = useState(false);
  const [UserRole, setUserRole] = useState('patient');
  const [User, setUser] = useState(null);
  const [bookedAppointments, setBookedAppointments] = useState([]); // GLOBAL booked appointments

  const services = [
    { title: "General Checkups", desc: "Routine health examinations.", category: "general" },
    { title: "Specialist Consultations", desc: "Top specialists.", category: "specialist" },
    { title: "Follow-up Appointments", desc: "Schedule follow-ups.", category: "followup" },
    { title: "Online Consultations", desc: "Video/audio calls.", category: "online" },
  ];

  const doctors = [
    // General Doctors
    {
      doctor_id: 1,
      name: "Dr. Ramesh Sharma",
      specialty: "General Physician",
      category: "general",
      experience: "10+ years",
      location: "HospiTex Main Campus",
      img: "https://randomuser.me/api/portraits/men/1.jpg",
      about: "Dr. Ramesh Sharma is a compassionate general physician who focuses on preventive care and patient education. He believes in thorough health checkups and early detection of potential health issues. Patients appreciate his approachable and empathetic manner, making consultations comfortable and informative.",
      appointmentFee: 500
    },
    {
      doctor_id: 2,
      name: "Dr. Meena Joshi",
      specialty: "Family Physician",
      category: "general",
      experience: "8+ years",
      location: "HospiTex Main Campus",
      img: "https://randomuser.me/api/portraits/women/5.jpg",
      about: "Dr. Meena Joshi provides holistic care for individuals and families. She emphasizes early detection, health education, and long-term wellness strategies. Her friendly approach and clear communication make her a favorite among patients of all ages.",
      appointmentFee: 450
    },

    // Specialist Doctors
    {
      doctor_id: 3,
      name: "Dr. Anita Kapoor",
      specialty: "Cardiologist",
      category: "specialist",
      experience: "12+ years",
      location: "HospiTex Cardiology Wing",
      img: "https://randomuser.me/api/portraits/women/2.jpg",
      about: "Dr. Anita Kapoor is a leading cardiologist specializing in heart disease prevention and management. She develops personalized treatment plans tailored to each patient’s needs. Known for her dedication and detailed approach, she ensures patients are well-informed about their heart health.",
      appointmentFee: 1200
    },
    {
      doctor_id: 4,
      name: "Dr. Sunil Verma",
      specialty: "Neurologist",
      category: "specialist",
      experience: "15+ years",
      location: "HospiTex Neuro Wing",
      img: "https://randomuser.me/api/portraits/men/3.jpg",
      about: "Dr. Sunil Verma is an expert in diagnosing and treating neurological disorders. He combines modern medical techniques with holistic care practices to improve patient outcomes. His calm and patient-focused approach helps patients feel confident and supported throughout their treatment journey.",
      appointmentFee: 1500
    },
    {
      doctor_id: 5,
      name: "Dr. Priya Nair",
      specialty: "Orthopedic Surgeon",
      category: "specialist",
      experience: "8+ years",
      location: "HospiTex Ortho Wing",
      img: "https://randomuser.me/api/portraits/women/4.jpg",
      about: "Dr. Priya Nair specializes in orthopedic surgery and rehabilitation. She focuses on improving mobility and quality of life for patients with musculoskeletal issues. Her careful and personalized treatment plans help patients recover efficiently and safely.",
      appointmentFee: 1000
    },

    // Follow-up Doctors
    {
      doctor_id: 6,
      name: "Dr. Rajesh Khanna",
      specialty: "Diabetologist",
      category: "followup",
      experience: "10+ years",
      location: "HospiTex Diabetes Clinic",
      img: "https://randomuser.me/api/portraits/men/6.jpg",
      about: "Dr. Rajesh Khanna provides specialized follow-up care for patients with diabetes. He monitors treatment progress closely and adjusts plans to ensure optimal health outcomes. His patient-focused approach emphasizes education and lifestyle modifications alongside medical treatment.",
      appointmentFee: 600
    },
    {
      doctor_id: 7,
      name: "Dr. Seema Reddy",
      specialty: "Dermatologist",
      category: "followup",
      experience: "7+ years",
      location: "HospiTex Skin Care Wing",
      img: "https://randomuser.me/api/portraits/women/7.jpg",
      about: "Dr. Seema Reddy specializes in follow-up care for skin conditions and cosmetic treatments. She guides patients through ongoing therapy and ensures consistent monitoring for best results. Her approachable and thorough style makes patients feel comfortable and informed.",
      appointmentFee: 700
    },

    // Online Consultation Doctors
    {
      doctor_id: 8,
      name: "Dr. Karan Mehta",
      specialty: "Psychologist",
      category: "online",
      experience: "9+ years",
      location: "HospiTex Online Services",
      img: "https://randomuser.me/api/portraits/men/8.jpg",
      about: "Dr. Karan Mehta provides online mental health consultations for stress, anxiety, and emotional well-being. He uses evidence-based therapy techniques tailored to individual needs. His empathetic and patient-centered approach ensures a safe environment for open discussions.",
      appointmentFee: 800
    },
    {
      doctor_id: 9,
      name: "Dr. Anjali Desai",
      specialty: "Nutritionist",
      category: "online",
      experience: "6+ years",
      location: "HospiTex Online Services",
      img: "https://randomuser.me/api/portraits/women/9.jpg",
      about: "Dr. Anjali Desai offers personalized online dietary consultations to promote healthy lifestyles. She creates tailored nutrition plans considering individual health goals. Her professional yet approachable style helps patients adopt sustainable eating habits.",
      appointmentFee: 500
    },
  ];

  const value = {
    IsLoggedIn, setIsLoggedIn,
    UserRole, setUserRole,
    User, setUser,
    services,
    doctors,
    bookedAppointments, // expose globally
    setBookedAppointments
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
