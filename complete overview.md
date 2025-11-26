# 🏥 HospiTex Hospital Management System - Complete Overview

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Three Main Components](#three-main-components)
3. [User Roles & Dashboards](#user-roles--dashboards)
4. [Complete Workflow](#complete-workflow)
5. [Features & Functionality](#features--functionality)
6. [How to Run](#how-to-run)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [File Structure](#file-structure)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HOSPI TEX SYSTEM                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐ │
│  │  HospiTex-UI │◄────►│HospiTex-Server│◄────►│  MyBot   │ │
│  │  (React)     │      │   (Node.js)   │      │ (Flask)  │ │
│  │  Port: 5173  │      │   Port: 5000   │      │ Port:5001│ │
│  └──────────────┘      └──────────────┘      └──────────┘ │
│         │                      │                    │        │
│         │                      │                    │        │
│         └──────────────────────┴────────────────────┘        │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │  MongoDB    │                          │
│                    │  Database   │                          │
│                    └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Three Main Components

### 1. **HospiTex-UI** (Frontend - React)
- **Location**: `F:\HospiTex\HospiTex-Ui`
- **Technology**: React + Vite + Tailwind CSS
- **Port**: 5173
- **Purpose**: User interface for all three dashboards
- **Features**:
  - Beautiful, modern UI with animations
  - Three separate dashboards (Patient, Doctor, Diagnostic)
  - Real-time updates
  - Responsive design (mobile-friendly)
  - MediBot chat integration

### 2. **HospiTex-Server** (Backend - Node.js/Express)
- **Location**: `F:\HospiTex\HospiTex-Server`
- **Technology**: Node.js + Express + MongoDB
- **Port**: 5000
- **Purpose**: Main API server handling all business logic
- **Features**:
  - Authentication & Authorization
  - Appointment management
  - Prescription management
  - Diagnostic reports
  - Ambulance requests
  - User management
  - **MediBot Proxy** (forwards requests to Flask backend)

### 3. **MyBot** (AI Chatbot - Flask)
- **Location**: `F:\HospiTex\MyBot`
- **Technology**: Python + Flask + RAG (Retrieval Augmented Generation)
- **Port**: 5001
- **Purpose**: AI-powered hospital assistant chatbot
- **Features**:
  - Answers hospital-related questions
  - Uses hospital knowledge base (7 knowledge files)
  - Chat history management
  - Context-aware responses

---

## 👥 User Roles & Dashboards

### 🟦 **Patient Dashboard**
**Access**: `/patient-dashboard`

**Features**:
- ✅ **Book Appointments** - Select doctor, date, time
- ✅ **View Appointment History** - See all past/upcoming appointments
- ✅ **Diagnostic Services** - Book lab tests, view reports
- ✅ **Ambulance Request** - Emergency ambulance booking
- ✅ **Profile Management** - Update personal information
- ✅ **MediBot Chat** - AI assistant for questions

**Navigation**:
- Home
- Book Appointment
- Diagnostic Services
- Ambulance
- Contact
- Profile
- Appointment History

**Key Files**:
- `HospiTex-Ui/src/Users/Patient/HomePage.jsx`
- `HospiTex-Ui/src/Users/Patient/PatientNavbar.jsx`
- `HospiTex-Ui/src/Users/Patient/Services/appointmentService.jsx`

---

### 🟩 **Doctor Dashboard**
**Access**: `/doctor-dashboard`

**Features**:
- ✅ **View Appointments** - See all patient appointments
- ✅ **Confirm/Complete Appointments** - Manage appointment status
- ✅ **Patient Records** - View patient medical history
- ✅ **Create Prescriptions** - Issue medications to patients
- ✅ **Profile Management** - Update doctor information
- ✅ **MediBot Chat** - AI assistant for medical queries

**Navigation**:
- Home
- Appointments
- Patient Records
- Contacts
- Profile

**Key Files**:
- `HospiTex-Ui/src/Users/Doctor/DoctorHomePage.jsx`
- `HospiTex-Ui/src/Users/Doctor/DoctorNavbar.jsx`
- `HospiTex-Ui/src/Users/Doctor/DoctorAppointmentServices.jsx`

---

### 🟪 **Diagnostic Dashboard**
**Access**: `/diagnostic-dashboard`

**Features**:
- ✅ **View Test Requests** - See all diagnostic test bookings
- ✅ **Upload Reports** - Add test results and reports
- ✅ **Manage Tests** - Update test status
- ✅ **Patient Reports** - View all diagnostic reports
- ✅ **Profile Management** - Update diagnostic center info
- ✅ **MediBot Chat** - AI assistant for diagnostic queries

**Navigation**:
- Home
- Reports
- Tests
- Contacts
- Profile

**Key Files**:
- `HospiTex-Ui/src/Users/Diagnostic/DiagnosticHomePage.jsx`
- `HospiTex-Ui/src/Users/Diagnostic/DiagnosticNavbar.jsx`
- `HospiTex-Ui/src/Users/Diagnostic/DiagnosticReportsServices.jsx`

---

## 🔄 Complete Workflow

### **Scenario 1: Patient Books Appointment**

```
1. Patient logs in → Redirected to Patient Dashboard
   ↓
2. Clicks "Book Appointment" → Sees list of doctors
   ↓
3. Selects a doctor → Chooses date & time
   ↓
4. Clicks "Book Appointment" → API call to /api/appointments/book
   ↓
5. Server creates appointment with status "Pending"
   ↓
6. Doctor sees appointment in their dashboard
   ↓
7. Doctor confirms → Status changes to "Confirmed"
   ↓
8. Patient receives notification (via email/UI)
   ↓
9. Appointment day → Doctor marks as "Completed"
   ↓
10. Doctor creates prescription if needed
```

**API Flow**:
```
React UI → POST /api/appointments/book
  → HospiTex-Server (Node.js)
    → Validates request
    → Creates appointment in MongoDB
    → Updates patient & doctor records
    → Returns success response
      → UI shows confirmation
```

---

### **Scenario 2: Patient Books Diagnostic Test**

```
1. Patient → Diagnostic Services section
   ↓
2. Selects test type → Chooses diagnostic center
   ↓
3. Books test → API call to /api/diagnostics/book
   ↓
4. Diagnostic center sees test request
   ↓
5. Center processes test → Uploads results
   ↓
6. Patient receives notification
   ↓
7. Patient views report in dashboard
   ↓
8. Report can be shared with doctor
```

**API Flow**:
```
React UI → POST /api/diagnostics/book
  → HospiTex-Server
    → Creates diagnostic report
    → Updates patient & diagnostic records
    → Returns success
```

---

### **Scenario 3: Using MediBot Chat**

```
1. Patient clicks MediBot icon (bottom right)
   ↓
2. Chat window opens
   ↓
3. Patient asks: "How do I book an appointment?"
   ↓
4. UI sends request to: /medibot/ask
   ↓
5. HospiTex-Server proxies to Flask: http://localhost:5001/ask
   ↓
6. Flask backend:
   - Searches hospital knowledge base (7 text files)
   - Finds relevant information
   - Uses AI (LLM) to generate answer
   ↓
7. Response sent back through proxy
   ↓
8. Patient sees answer in chat
```

**API Flow**:
```
React UI → POST /medibot/ask
  → HospiTex-Server (Proxy)
    → POST http://localhost:5001/ask
      → Flask Backend
        → Searches knowledge base
        → Generates AI response
        → Returns answer
          → HospiTex-Server forwards
            → UI displays answer
```

---

## 🎯 Features & Functionality

### **Authentication System**
- ✅ User Registration (Patient/Doctor/Diagnostic)
- ✅ Login/Logout
- ✅ Email Verification (OTP)
- ✅ Password Reset
- ✅ JWT Token-based authentication
- ✅ Role-based access control
- ✅ Secure cookie management

**Files**:
- `HospiTex-Server/Controller/authController.js`
- `HospiTex-Server/routes/authRoutes.js`
- `HospiTex-Ui/src/Auth/Login.jsx`

---

### **Appointment Management**
- ✅ Book appointments
- ✅ View appointment history
- ✅ Cancel appointments
- ✅ Doctor confirmation workflow
- ✅ Status tracking (Pending → Confirmed → Completed)
- ✅ Email notifications

**Files**:
- `HospiTex-Server/Controller/appointmentController.js`
- `HospiTex-Server/routes/appointmentRoutes.js`
- `HospiTex-Ui/src/Users/Patient/Services/appointmentService.jsx`
- `HospiTex-Ui/src/Users/Patient/AppointmentHistory.jsx`
- `HospiTex-Ui/src/Users/Doctor/DoctorAppointmentServices.jsx`

---

### **Prescription Management**
- ✅ Doctors create prescriptions
- ✅ Multiple medications per prescription
- ✅ Dosage, frequency, duration
- ✅ Patient can view all prescriptions
- ✅ Prescription history

**Files**:
- `HospiTex-Server/Controller/prescriptionController.js`
- `HospiTex-Server/routes/prescriptionRoutes.js`

---

### **Diagnostic Services**
- ✅ Book diagnostic tests
- ✅ Upload test results
- ✅ View reports
- ✅ Share reports with doctors
- ✅ Test status tracking

**Files**:
- `HospiTex-Server/Controller/diagnosticController.js`
- `HospiTex-Server/routes/diagnosticRoutes.js`
- `HospiTex-Ui/src/Users/Patient/Services/DiagnosticServices.jsx`
- `HospiTex-Ui/src/Users/Diagnostic/DiagnosticReportsServices.jsx`

---

### **Ambulance Services**
- ✅ Request ambulance
- ✅ Emergency contact
- ✅ Status tracking
- ✅ Location tracking

**Files**:
- `HospiTex-Server/Controller/ambulanceController.js`
- `HospiTex-Server/routes/ambulanceRoutes.js`
- `HospiTex-Ui/src/Users/Patient/Services/AmbulanceServices.jsx`

---

### **MediBot AI Assistant**
- ✅ Hospital knowledge base (7 knowledge files)
- ✅ Answers questions about:
  - Patient booking
  - Doctor services
  - Diagnostic tests
  - Hospital policies
  - Emergency services
- ✅ Chat history
- ✅ Context-aware responses

**Knowledge Base Files** (in `MyBot/data/text_files/`):
1. `patient_booking.txt` - Appointment booking process
2. `doctor_services.txt` - Doctor consultation services
3. `diagnostic_services.txt` - Diagnostic tests and reports
4. `hospital_services.txt` - Overall hospital system
5. `emergency_services.txt` - Emergency and ambulance
6. `medical_records.txt` - Medical records and prescriptions
7. `hospital_policies.txt` - Hospital policies and procedures

**Files**:
- `MyBot/main.py` - Flask backend
- `MyBot/src/chatbot.py` - Chatbot logic
- `MyBot/src/llm.py` - AI model integration
- `HospiTex-Server/Medibot/medibot.js` - Proxy routes
- `HospiTex-Ui/src/MediBot/MediBot.jsx` - UI component

---

## 🚀 How to Run

### **Prerequisites**
- Node.js (v16 or higher)
- Python 3.8+
- MongoDB (running locally or connection string)
- npm or yarn
- pip (Python package manager)

---

### **Step 1: Start MongoDB**
```bash
# Make sure MongoDB is running
mongod
# Or use MongoDB Atlas connection string
```

---

### **Step 2: Start Flask MediBot Backend**

```bash
cd MyBot

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Add: OPENROUTER_API_KEY=your_api_key_here

# Run Flask server
python main.py
```

**Server runs on**: `http://localhost:5001`

**What it does**:
- Loads hospital knowledge base
- Initializes RAG (Retrieval Augmented Generation) system
- Creates vector embeddings
- Starts Flask API server

---

### **Step 3: Start Node.js Server**

```bash
cd HospiTex-Server

# Install dependencies
npm install

# Create .env file
# Add:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/hospitex
# JWT_SECRET=your_secret_key
# MEDIBOT_URL=http://localhost:5001

# Run server
npm run server
```

**Server runs on**: `http://localhost:5000`

**What it does**:
- Connects to MongoDB
- Sets up all API routes
- Proxies MediBot requests to Flask
- Handles authentication
- Manages all business logic

---

### **Step 4: Start React UI**

```bash
cd HospiTex-Ui

# Install dependencies
npm install

# Run development server
npm run dev
```

**Application runs on**: `http://localhost:5173`

**What it does**:
- Serves React application
- Connects to backend API (localhost:5000)
- Provides three dashboards
- Integrates MediBot chat

---

### **Step 5: Access the System**

1. Open browser: `http://localhost:5173`
2. Register/Login as:
   - **Patient** - For booking appointments
   - **Doctor** - For managing appointments
   - **Diagnostic** - For managing tests
3. Start using the system!

---

## 📡 API Endpoints

### **Authentication** (`/auth/*`)
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/verify-account` - Verify email with OTP
- `POST /auth/send-verify-otp` - Send verification OTP
- `POST /auth/send-reset-otp` - Send password reset OTP
- `POST /auth/reset-password` - Reset password
- `POST /auth/is-auth` - Check authentication status

### **Appointments** (`/api/appointments/*`)
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/patient` - Get patient appointments
- `GET /api/appointments/doctor/all` - Get doctor appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id/status` - Update appointment status
- `DELETE /api/appointments/:id/cancel` - Cancel appointment

### **Prescriptions** (`/api/prescriptions/*`)
- `POST /api/prescriptions/create` - Create prescription
- `GET /api/prescriptions/patient/all` - Patient prescriptions
- `GET /api/prescriptions/doctor/all` - Doctor prescriptions
- `GET /api/prescriptions/:id` - Get prescription by ID
- `PUT /api/prescriptions/:id` - Update prescription

### **Diagnostics** (`/api/diagnostics/*`)
- `POST /api/diagnostics/book` - Book diagnostic test
- `GET /api/diagnostics/patient/reports` - Patient reports
- `GET /api/diagnostics/diagnostic/reports` - All reports
- `GET /api/diagnostics/:id` - Get report by ID
- `PUT /api/diagnostics/:id` - Update report

### **Ambulance** (`/api/ambulance/*`)
- `POST /api/ambulance/request` - Request ambulance
- `GET /api/ambulance/patient/requests` - Patient requests
- `GET /api/ambulance/all` - All requests (admin)
- `GET /api/ambulance/:id` - Get request by ID
- `PUT /api/ambulance/:id/status` - Update status
- `DELETE /api/ambulance/:id/cancel` - Cancel request

### **Users** (`/api/users/*`)
- `GET /api/users/doctors` - List all doctors (public)
- `GET /api/users/diagnostics` - List all diagnostics (public)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/profile/create` - Create role-specific profile

### **MediBot** (`/medibot/*`)
- `GET /medibot/chat/new` - Create new chat session
- `POST /medibot/ask` - Ask MediBot a question
- `GET /medibot/chat/list` - List all chat sessions
- `GET /medibot/chat/:id` - Get chat by ID
- `POST /medibot/chat/activate/:id` - Activate chat
- `DELETE /medibot/chat/delete/:id` - Delete chat
- `GET /medibot/health` - Health check

---

## 📊 Database Schema

### **MongoDB Collections**

#### **users**
```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed),
  role: String (Patient/Doctor/Diagnostic/Admin),
  verifyOtp: String,
  verifyOtpExpireAt: Date,
  isAccountVerified: Boolean,
  resetOtp: String,
  resetOtpExpireAt: Date,
  timestamps: true
}
```

#### **patients**
```javascript
{
  user: ObjectId (ref: User),
  appointments: [ObjectId] (ref: Appointment),
  diagnosticReports: [ObjectId] (ref: DiagnosticReport)
}
```

#### **doctors**
```javascript
{
  user: ObjectId (ref: User),
  appointments: [ObjectId] (ref: Appointment),
  prescriptions: [ObjectId] (ref: Prescription)
}
```

#### **diagnostics**
```javascript
{
  user: ObjectId (ref: User),
  diagnosticReports: [ObjectId] (ref: DiagnosticReport),
  patients: [ObjectId] (ref: User)
}
```

#### **appointments**
```javascript
{
  patient: ObjectId (ref: User),
  doctor: ObjectId (ref: User),
  date: Date,
  time: String,
  service: String,
  status: String (Pending/Confirmed/Completed/Cancelled),
  notes: String,
  appointmentFee: Number,
  doctorName: String,
  doctorSpecialty: String,
  doctorLocation: String,
  doctorImage: String,
  timestamps: true
}
```

#### **prescriptions**
```javascript
{
  patient: ObjectId (ref: User),
  doctor: ObjectId (ref: User),
  appointment: ObjectId (ref: Appointment),
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  diagnosis: String,
  notes: String,
  followUpDate: Date,
  timestamps: true
}
```

#### **diagnosticreports**
```javascript
{
  patient: ObjectId (ref: User),
  diagnostic: ObjectId (ref: User),
  testName: String,
  testType: String,
  testDate: Date,
  results: Object,
  reportFile: String,
  status: String (Pending/In Progress/Completed),
  notes: String,
  doctor: ObjectId (ref: User),
  timestamps: true
}
```

#### **ambulances**
```javascript
{
  patient: ObjectId (ref: User),
  pickupLocation: String,
  destination: String,
  emergencyType: String,
  patientName: String,
  contactNumber: String,
  status: String (Pending/Dispatched/In Transit/Completed/Cancelled),
  estimatedTime: String,
  notes: String,
  timestamps: true
}
```

---

## 📁 File Structure

### **HospiTex-Server/**
```
HospiTex-Server/
├── config/
│   ├── db.js              # MongoDB connection
│   └── nodemailer.js      # Email configuration
├── Controller/
│   ├── authController.js       # Authentication logic
│   ├── appointmentController.js  # Appointment logic
│   ├── prescriptionController.js  # Prescription logic
│   ├── diagnosticController.js   # Diagnostic logic
│   ├── ambulanceController.js    # Ambulance logic
│   └── userController.js         # User management
├── Medibot/
│   └── medibot.js         # MediBot proxy routes
├── middleware/
│   └── userAuth.js        # JWT authentication middleware
├── models/
│   └── schema.js          # MongoDB schemas
├── routes/
│   ├── authRoutes.js
│   ├── appointmentRoutes.js
│   ├── prescriptionRoutes.js
│   ├── diagnosticRoutes.js
│   ├── ambulanceRoutes.js
│   └── userRoutes.js
├── server.js              # Main server file
└── package.json
```

### **HospiTex-Ui/**
```
HospiTex-Ui/
├── src/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── AppContext.jsx
│   │   └── EmailVerify.jsx
│   ├── Users/
│   │   ├── Patient/
│   │   │   ├── HomePage.jsx
│   │   │   ├── PatientNavbar.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   ├── AppointmentHistory.jsx
│   │   │   ├── Diagnostic.jsx
│   │   │   ├── Ambulance.jsx
│   │   │   └── Services/
│   │   │       ├── appointmentService.jsx
│   │   │       ├── DiagnosticServices.jsx
│   │   │       └── AmbulanceServices.jsx
│   │   ├── Doctor/
│   │   │   ├── DoctorHomePage.jsx
│   │   │   ├── DoctorNavbar.jsx
│   │   │   ├── DoctorAppointmentServices.jsx
│   │   │   └── DoctorPatientRecordsServices.jsx
│   │   └── Diagnostic/
│   │       ├── DiagnosticHomePage.jsx
│   │       ├── DiagnosticNavbar.jsx
│   │       ├── DiagnosticReportsServices.jsx
│   │       └── DiagnosticTestsServices.jsx
│   ├── MediBot/
│   │   └── MediBot.jsx    # AI chatbot component
│   ├── components/
│   │   └── DoctorCard.jsx
│   ├── pages/
│   │   └── commonDashboard.jsx
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

### **MyBot/**
```
MyBot/
├── data/
│   ├── text_files/        # Hospital knowledge base
│   │   ├── patient_booking.txt
│   │   ├── doctor_services.txt
│   │   ├── diagnostic_services.txt
│   │   ├── hospital_services.txt
│   │   ├── emergency_services.txt
│   │   ├── medical_records.txt
│   │   └── hospital_policies.txt
│   ├── pdf/               # PDF documents (if any)
│   └── vector_store/      # Vector embeddings
├── database/
│   └── medibot.db         # SQLite database for chat history
├── src/
│   ├── chatbot.py         # Main chatbot class
│   ├── loader.py          # Document loader
│   ├── chunker.py         # Text chunking
│   ├── embedding.py       # Embedding model
│   ├── vectorstore.py     # Vector store
│   ├── retriever.py       # RAG retriever
│   └── llm.py             # AI model integration
├── main.py                # Flask application
├── requirements.txt
└── .env                   # Environment variables
```

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based authorization
- ✅ Secure cookie management
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection

---

## 🎨 UI Improvements Made

### **Navigation Bars**
- ✅ Modern design with backdrop blur
- ✅ Active route highlighting with gradients
- ✅ Smooth animations (Framer Motion)
- ✅ Mobile responsive menu
- ✅ Role-specific color themes:
  - Patient: Blue/Cyan
  - Doctor: Emerald/Green
  - Diagnostic: Purple/Indigo

### **Components**
- ✅ Enhanced DoctorCard with better layout
- ✅ Improved AppointmentHistory with card design
- ✅ Better spacing and typography
- ✅ Gradient backgrounds
- ✅ Professional shadows and borders
- ✅ Icon integration (Lucide React)

### **User Experience**
- ✅ Smooth transitions
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Accessibility improvements

---

## 🔄 Data Flow Examples

### **Patient Books Appointment**
```
1. User clicks "Book Appointment" in UI
   ↓
2. React sends POST /api/appointments/book
   ↓
3. Node.js server validates request
   ↓
4. Creates appointment document in MongoDB
   ↓
5. Updates patient.appointments array
   ↓
6. Updates doctor.appointments array
   ↓
7. Returns success response
   ↓
8. UI shows confirmation
   ↓
9. Email notification sent (if configured)
```

### **MediBot Question Flow**
```
1. User types question in MediBot chat
   ↓
2. React sends POST /medibot/ask
   ↓
3. Node.js server receives request
   ↓
4. Proxies to Flask: POST http://localhost:5001/ask
   ↓
5. Flask searches knowledge base using RAG
   ↓
6. Finds relevant context from 7 knowledge files
   ↓
7. AI model generates answer
   ↓
8. Flask returns response
   ↓
9. Node.js forwards to React
   ↓
10. UI displays answer in chat
```

---

## 🎯 Key Features Summary

1. **Three Separate Dashboards** - Patient, Doctor, Diagnostic
2. **Complete Appointment System** - Booking, confirmation, tracking
3. **Prescription Management** - Create and view prescriptions
4. **Diagnostic Services** - Test booking and report management
5. **Ambulance Services** - Emergency request system
6. **AI Chatbot (MediBot)** - Hospital assistant with knowledge base
7. **User Authentication** - Secure login/registration
8. **Profile Management** - Update user information
9. **Modern UI** - Beautiful, responsive design
10. **Real-time Updates** - Live status changes
11. **Email Notifications** - Automated email sending
12. **Role-based Access** - Secure authorization

---

## 🐛 Troubleshooting

### **MediBot not responding?**
- Check if Flask server is running on port 5001
- Verify OPENROUTER_API_KEY in MyBot/.env
- Check console for errors

### **API calls failing?**
- Ensure Node.js server is running on port 5000
- Check MongoDB connection
- Verify JWT token in cookies

### **UI not loading?**
- Check if React dev server is running on port 5173
- Verify all dependencies are installed
- Check browser console for errors

---

## 📝 Environment Variables

### **HospiTex-Server/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospitex
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
SENDER_EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
MEDIBOT_URL=http://localhost:5001
```

### **MyBot/.env**
```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

---

## 🚀 Production Deployment

### **For Production:**
1. Set `NODE_ENV=production`
2. Use secure JWT secrets
3. Configure proper CORS origins
4. Use MongoDB Atlas or secure database
5. Set up SSL/HTTPS
6. Configure environment variables securely
7. Build React app: `npm run build`
8. Use PM2 or similar for process management

---

## 📞 Support

For issues or questions:
- Check the code comments
- Review API responses
- Check server logs
- Verify database connections

---

## 🎉 Conclusion

This is a **complete, production-ready hospital management system** with:
- ✅ Full-stack implementation
- ✅ Three user dashboards
- ✅ Complete CRUD operations
- ✅ AI-powered chatbot
- ✅ Modern, responsive UI
- ✅ Secure authentication
- ✅ Real-time updates

**All features are implemented and ready to use!** 🚀

