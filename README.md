
# 🏥 HospiTex - Smart Hospital Management System

HospiTex is a **MERN-based hospital management system** that provides dashboards and services for **patients, doctors, diagnostics, and ambulance services**. It also features an AI chatbot called **MediBot** to assist users.

---

## 🌟 Features

- **Role-based dashboards** for Patients, Doctors, Diagnostics, and Ambulance services.
- **Authentication system** with JWT, email verification, and password reset.
- **MediBot AI chatbot** for health guidance.
- **Appointment and service booking** for patients.
- **Secure backend** with Node.js, Express, and MongoDB.
- **Responsive frontend** using React, Tailwind CSS, and Vite.

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
│   ├── controllers/            # Business logic
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── doctorController.js
│   │   ├── diagnosticController.js
│   │   └── medibot.js
│   │
│   ├── models/                 # MongoDB Schemas
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Doctor.js
│   │   └── Diagnostic.js
│   │
│   ├── routes/                 # API Routes
│   │   ├── authRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── diagnosticRoutes.js
│   │
│   ├── middleware/             # Authentication & error handling
│   │   └── userAuth.js
│   │
│   ├── .env                    # Environment variables
│   ├── package.json             # Backend dependencies
│   └── server.js                # Backend entry point
│
├── HospiTex-Ui/                # Frontend (React + Tailwind + Vite)
│   ├── public/                 # Static files
│   │   ├── index.html
│   │   └── favicon.ico
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
│   │   │   │   ├── PatientDashboard.jsx
│   │   │   │   ├── PatientNavbar.jsx
│   │   │   │   └── HomePage.jsx
│   │   │   │
│   │   │   ├── Doctor/
│   │   │   │   └── DoctorDashboard.jsx
│   │   │   │
│   │   │   ├── Diagnostic/
│   │   │   │   └── DiagnosticDashboard.jsx
│   │   │   │
│   │   │   └── Ambulance/
│   │   │       └── AmbulanceDashboard.jsx
│   │   │
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Medibot.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── commonDashboard.jsx
│   │   │
│   │   ├── context/
│   │   │   └── PatientContext.jsx
│   │   │
│   │   ├── assets/             # Images, icons, SVGs
│   │   ├── styles/             # Tailwind / CSS
│   │   │   └── style.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env                    # Frontend environment variables
│   └── package.json
│
├── README.md                   # Project documentation
└── .gitignore

````

---

## 🚀 Setup & Run Locally

1. **Clone the repo:**

```bash
git clone https://github.com/rajnishkumar1906/HospiTex.git
cd HospiTex
````

2. **Install backend dependencies:**

```bash
cd HospiTex-Server
npm install
```

3. **Install frontend dependencies:**

```bash
cd ../HospiTex-Ui
npm install
```

4. **Run both frontend & backend:**

```bash
npm run dev
```

The backend runs on `http://localhost:5000` and frontend on `http://localhost:5173` (Vite default).

---

## 🔐 Authentication Flow

1. Users visit the site.
2. If not logged in, redirected to **Login page**.
3. Submit login form → `login()` updates user info in React Context.
4. Based on **role (Patient, Doctor, Diagnostic)**, redirect to respective dashboard.
5. Protected routes prevent unauthorized access using `RequireAuth`.
6. Navbar and pages render dynamically based on **role**.

---

## 🛠 Tech Stack

* **Frontend:** React, Tailwind CSS, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT, bcrypt, email OTP verification
* **Others:** Nodemailer, MediBot AI integration

---

## 📌 Notes

* Ensure `.env` files are configured in both frontend and backend.
* Backend `.env` example:

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
SENDER_EMAIL=youremail@example.com
EMAIL_PASSWORD=your_email_password
```

* Frontend `.env` example:

```
VITE_API_URL=http://localhost:5000
```

---

This README reflects **full project structure**, **role-based dashboards**, **authentication**, and **AI chatbot integration**.

```

I can also make a **GitHub-ready commit version** with this updated README so you can push it directly.  

Do you want me to create that commit-ready file next?
```
