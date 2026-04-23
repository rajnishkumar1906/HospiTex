# 🏥 HospiTex - Smart Hospital Management System

HospiTex is a comprehensive healthcare platform featuring a **MERN-based management system** and a **RAG-powered AI Medical Assistant (MediBot)**. It provides specialized dashboards for Patients, Doctors, Diagnostics, and Admins, integrated with professional email templates, real-time notifications, and secure cloud storage.

---

## 🚀 Recent Updates
- **WhatsApp-Style Consultations**: Unified chat and prescription system within the dashboard.
- **MediBot AI Integration**: Advanced RAG-powered chatbot for patient assistance (60% centered UI).
- **Cloudinary Integration**: Secure cloud storage for all medical reports and prescriptions.
- **Enhanced Security**: Secure backend proxy for AI services and JWT-based role protection.

---

## 🛠 Tech Stack

### Frontend
- **React 18** + **Vite** (Lightning fast builds)
- **Tailwind CSS** (Modern UI styling)
- **Lucide React** (Beautiful iconography)
- **React Router 6** (Nested routing for dashboards)
- **Axios** (API communication)

### Backend
- **Node.js** & **Express** (Robust server logic)
- **MongoDB** & **Mongoose** (Scalable NoSQL database)
- **Socket.io** (Real-time chat & notifications)
- **Cloudinary** (Medical file storage)
- **Nodemailer** (Professional HTML email system)

### AI Service (MediBot)
- **Python 3.11** + **Flask**
- **LangChain** & **ChromaDB** (RAG Architecture)
- **Sentence-Transformers** (Local embeddings)
- **OpenRouter API** (Access to Gemini, DeepSeek, & Llama models)

---

## 📂 Project Structure

```
HospiTex/
├── HospiTex-Ui/             # React Frontend
│   ├── src/components/      # Reusable UI (MediBot, ConsultationRoom, etc.)
│   ├── src/pages/           # Role-based dashboards
│   └── src/context/         # Global state management
├── hospitex-backend/        # Node.js API Server
│   ├── controllers/         # Business logic (Bot proxy, Consultations, etc.)
│   ├── models/              # MongoDB Schemas
│   ├── routes/              # API Endpoints
│   └── config/              # Cloudinary & DB setup
└── Medibot/                 # Python AI Service
    ├── src/                 # RAG logic (Retriever, LLM, Chunker)
    ├── data/                # Ingested medical documents
    └── main.py              # Flask API for AI service
```

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js (v16+)
- Python 3.11 (`D:\agroenv` venv recommended)
- MongoDB (Local or Atlas)
- Cloudinary Account

### 2. Backend Setup
```bash
cd hospitex-backend
npm install
# Configure .env with CLOUDINARY_URL, MONGO_URI, and BOT_URL
npm start
```

### 3. Frontend Setup
```bash
cd HospiTex-Ui
npm install
npm run dev
```

### 4. MediBot AI Setup
```bash
cd Medibot
# Activate your venv (D:\agroenv)
D:\agroenv\Scripts\python.exe main.py
```

---

## 👥 User Roles
- **Patients**: Book appointments, chat with MediBot, view unified prescriptions in consultation rooms.
- **Doctors**: Manage appointments, start real-time consultations, and issue WhatsApp-style prescriptions.
- **Diagnostics**: Upload reports directly to Cloudinary and notify patients.
- **Admins**: oversee verification of Doctors/Diagnostics and platform statistics.

---

## 🔐 Environment Variables

### Backend (`.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=dolygexoe
BOT_URL=http://localhost:5001
```

### MediBot (`.env`)
```env
OPENROUTER_API_KEY=your_key
```

---

## 🎯 Future Enhancements
- [ ] Mobile application using React Native.
- [ ] Integration with wearable health devices.
- [ ] Advanced analytics for hospital administrators.
- [ ] Multi-language support for MediBot.

---
*Developed with ❤️ for the future of Healthcare.*
