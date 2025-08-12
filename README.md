# HospiTex

## Project Overview

HospiTex is a comprehensive full-stack application designed to manage various aspects of a hospital's operations. The platform is built with a role-based access control (RBAC) system, providing a tailored experience for different user types, including Admin, Doctor, Patient, and Diagnostic staff. The application features a dedicated API for backend services and a modern, component-driven user interface.

---

## Features

### HospiTex-Server (Backend)
* **Role-Based Routing:** Dedicated API routes for different user roles (`/admin`, `/doctor`, `/patient`, `/diagnostic`) to ensure secure and controlled access to data.
* **User Management:** Robust user authentication and management for all hospital personnel and patients.
* **Database Models:** Clearly defined data models for users, appointments, patient records, and other key entities.
* **Middleware & Utilities:** Custom middleware for security and helper functions for common tasks.

### HospiTex-UI (Frontend)
* **Dedicated User Interfaces:** Separate and specialized dashboards and components for each user role (Admin, Ambulance, Diagnostic, Doctor, Patient).
* **Appointment Management:** Functionality for patients to book appointments and for doctors to view and manage their schedule.
* **Patient Records:** Secure views for doctors to access patient records and for patients to view their own history.
* **Hospital Services:** Dedicated views for services like `Ambulance` and `Diagnostic` services.
* **Component-based Architecture:** A well-organized `src` directory with reusable components, context for state management, and clear routing.

---

## Technologies Used

### Backend (HospiTex-Server)
* **Node.js:** The JavaScript runtime environment.
* **Express.js:** The web application framework for building the API.
* **Database:** (e.g., MongoDB, PostgreSQL, or MySQL) - *Specify your database here.*

### Frontend (HospiTex-Ui)
* **React:** The JavaScript library for building the user interface.
* **Vite:** The fast build tool for the development server.
* **JavaScript (ES6+):** For all front-end logic.
* **CSS:** For styling the application.

---

## Installation and Setup

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/rajnishkumar1906/HospiTex.git](https://github.com/rajnishkumar1906/HospiTex.git)
cd HospiTex