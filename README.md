# 🏥 HospiTex - Smart Hospital Management System

HospiTex is a **MERN-based hospital management system** that provides comprehensive dashboards and services for **patients, doctors, diagnostics, admins, and ambulance services**. It features a pan-India hierarchical admin system, professional email notifications, and an AI chatbot called **MediBot** to assist users.

---

## 🌟 Features

- **Role-based dashboards** for Patients, Doctors, Diagnostics, Admins, and Ambulance services
- **Pan-India hierarchical admin system** (State Admin and District Admin)
- **Authentication system** with JWT, email OTP verification, and password reset
- **Professional HTML email templates** for welcome, login, OTP, and verification emails
- **Notification system** with real-time updates across all dashboards
- **MediBot AI chatbot** for health guidance
- **Appointment and service booking** for patients (auto-confirmed, no admin approval needed)
- **Doctor verification system** - District admins verify doctors and diagnostics
- **Patient auto-verification** - Patients are automatically verified upon signup
- **Secure backend** with Node.js, Express, and MongoDB
- **Responsive frontend** using React, Tailwind CSS, and Vite
- **Professional UI/UX** with sidebar navigation for Doctor dashboard

---

## 📂 Project Structure

```
HospiTex/
│
├── HospiTex-Server/            # Backend (Node.js + Express + MongoDB)
│   ├── config/                 # Configurations
│   │   ├── db.js               # MongoDB connection
│   │   └── nodemailer.js       # Email transporter
│   │
│   ├── Controller/             # Business logic
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── appointmentController.js
│   │   ├── diagnosticController.js
│   │   ├── prescriptionController.js
│   │   ├── notificationController.js
│   │   └── userController.js
│   │
│   ├── models/                 # MongoDB Schemas
│   │   └── schema.js           # All schemas (User, Patient, Doctor, Diagnostic, Admin, Notification, etc.)
│   │
│   ├── routes/                 # API Routes
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── diagnosticRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── prescriptionRoutes.js
│   │
│   ├── utils/                  # Utility functions
│   │   ├── emailTemplates.js   # Professional HTML email templates
│   │   └── indianStatesDistricts.js  # Indian states and districts data
│   │
│   ├── middleware/             # Authentication & error handling
│   │   └── userAuth.js
│   │
│   ├── .env                    # Environment variables
│   ├── package.json            # Backend dependencies
│   └── server.js               # Backend entry point
│
├── HospiTex-Ui/                # Frontend (React + Tailwind + Vite)
│   ├── public/                 # Static files
│   │   ├── index.html
│   │   └── Pictures/           # Images and assets
│   │
│   ├── src/
│   │   ├── Auth/               # Authentication components
│   │   │   ├── AppContext.jsx
│   │   │   ├── Login.jsx
│   │   │   └── EmailVerify.jsx
│   │   │
│   │   ├── MediBot/            # AI chatbot
│   │   │   └── MediBot.jsx
│   │   │
│   │   ├── Users/              # Role-based dashboards
│   │   │   ├── Patient/
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── PatientNavbar.jsx
│   │   │   │   ├── PatientProfile.jsx
│   │   │   │   └── Services/   # Service components
│   │   │   │
│   │   │   ├── Doctor/
│   │   │   │   ├── DoctorHomePage.jsx
│   │   │   │   ├── DoctorNavbar.jsx    # Sidebar navigation
│   │   │   │   ├── DoctorHome.jsx
│   │   │   │   ├── DoctorProfile.jsx
│   │   │   │   ├── DoctorAppointmentServices.jsx
│   │   │   │   └── DoctorPatientRecordsServices.jsx
│   │   │   │
│   │   │   ├── Diagnostic/
│   │   │   │   ├── DiagnosticHomePage.jsx
│   │   │   │   ├── DiagnosticNavbar.jsx
│   │   │   │   ├── DiagnosticProfile.jsx
│   │   │   │   └── DiagnosticReportsServices.jsx
│   │   │   │
│   │   │   └── Admin/
│   │   │       ├── AdminHomePage.jsx
│   │   │       ├── AdminNavbar.jsx
│   │   │       ├── AdminHome.jsx
│   │   │       ├── AdminProfile.jsx
│   │   │       ├── AdminUsersServices.jsx
│   │   │       └── VerificationReviewModal.jsx
│   │   │
│   │   ├── components/         # Reusable components
│   │   │   ├── DoctorCard.jsx
│   │   │   └── NotificationBell.jsx  # Notification component
│   │   │
│   │   ├── config/
│   │   │   └── axios.js        # API client configuration
│   │   │
│   │   ├── App.jsx             # Main app with routes
│   │   └── main.jsx
│   │
│   ├── .env                    # Frontend environment variables
│   └── package.json
│
├── MyBot/                      # AI Chatbot (Python + Flask)
│   ├── src/
│   │   └── chatbot.py
│   └── main.py
│
├── README.md                   # Project documentation
└── .gitignore
```

---

## 🚀 Setup & Run Locally

1. **Clone the repo:**

```bash
git clone https://github.com/rajnishkumar1906/HospiTex.git
cd HospiTex
```

2. **Install backend dependencies:**

```bash
cd HospiTex-Server
npm install
```

3. **Configure backend environment variables:**

Create a `.env` file in `HospiTex-Server/` with:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
SENDER_EMAIL=youremail@example.com
EMAIL_PASSWORD=your_email_password
```

4. **Install frontend dependencies:**

```bash
cd ../HospiTex-Ui
npm install
```

5. **Run backend server:**

```bash
cd ../HospiTex-Server
npm start
# or for development
npm run dev
```

6. **Run frontend (in a new terminal):**

```bash
cd HospiTex-Ui
npm run dev
```

The backend runs on `http://localhost:5000` and frontend on `http://localhost:5173` (Vite default).

---

## 🔐 Authentication Flow

1. Users visit the site and can sign up with role selection (Patient, Doctor, Diagnostic, Admin)
2. **Patients** are automatically verified upon signup
3. **Doctors and Diagnostics** require admin verification (District Admin verifies users in their district)
4. **Admins** are automatically verified
5. Email OTP verification is available for all users
6. Login uses JWT tokens stored in cookies
7. Based on **role (Patient, Doctor, Diagnostic, Admin)**, users are redirected to their respective dashboard
8. Protected routes prevent unauthorized access using `RequireAuth`
9. Navbars and pages render dynamically based on **role**

---

## 👥 User Roles & Features

### 🟦 Patient Dashboard
- Book appointments (auto-confirmed)
- View appointment history
- Book diagnostic tests
- Request ambulance services
- View prescriptions and medical records
- Contact support
- Profile management
- Real-time notifications

### 🟩 Doctor Dashboard
- **Sidebar navigation** for easy access
- View and manage appointments (Confirm, Complete, Cancel)
- Manage patient records and medical histories
- Create prescriptions
- View appointment statistics
- Professional profile management
- Real-time notifications

### 🟪 Diagnostic Dashboard
- View and manage diagnostic test bookings
- Upload test reports
- Manage patient reports
- Profile management
- Real-time notifications

### 🟣 Admin Dashboard (Pan-India System)
- **State Admin**: Manages entire state
- **District Admin**: Manages specific district
- Verify doctors and diagnostics (with detailed review modal)
- View user statistics
- Manage user accounts
- Real-time notifications

---

## 📧 Email System

The system uses professional HTML email templates for:
- **Welcome emails** - Sent upon user registration
- **Login notifications** - Sent after each login
- **OTP verification** - For email verification and password reset
- **Verification status** - When account is verified/rejected

All emails are styled with modern HTML templates for a professional appearance.

---

## 🔔 Notification System

- Real-time notifications across all dashboards
- Notification bell icon in all navbars
- Notifications for:
  - Appointment bookings and status changes
  - Account verification status
  - Diagnostic test bookings and report completions
  - Prescription creation
  - And more...

---

## 🛠 Tech Stack

* **Frontend:** React, Tailwind CSS, Vite, Framer Motion
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT, bcrypt, email OTP verification
* **Email:** Nodemailer with HTML templates
* **AI Chatbot:** Python Flask (MediBot)
* **Others:** Axios, React Router DOM, React Toastify

---

## 📋 Key System Features

### Pan-India Admin Hierarchy
- **State Admin**: One per state, manages all districts
- **District Admin**: One per district, verifies doctors and diagnostics
- **Location-based verification**: District admins can only verify users in their district

### Appointment System
- Patients can book appointments with available time slots
- Appointments are auto-confirmed (no admin approval needed)
- Doctors manage their own appointments
- Real-time availability checking

### Verification System
- Patients: Auto-verified
- Doctors & Diagnostics: Require District Admin verification
- Admins: Auto-verified
- Verification review modal shows detailed information before approval

---

## 📌 Important Notes

* Ensure `.env` files are configured in both frontend and backend
* Backend `.env` requires email credentials for OTP and notification emails
* The system uses MongoDB for data storage
* MediBot AI chatbot requires Python Flask server (optional)
* All user roles support notification system
* Doctor dashboard uses sidebar navigation for better UX

---

## 🎯 Future Enhancements

* Complete pan-India signup flow with state/district selection
* Admin dashboard filtering by district/state
* Enhanced analytics and reporting
* Mobile app support
* Integration with payment gateways
