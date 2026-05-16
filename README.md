# Smart Hospital Queue Management System

A production-ready full-stack web application designed to digitize patient appointments, queue handling, and waiting time tracking for hospitals and clinics. 

## Features

- **Role-Based Access Control:** Secure, customized dashboards for Patients, Doctors, and Admins.
- **Geographic Filtering:** 5-tier cascading dropdown booking flow (City → Location → Hospital → Department → Doctor).
- **Live Queue Tracking:** Automated digital token generation and real-time waiting status updates (Waiting, In Progress, Completed, Skipped).
- **Multi-Language Support:** Integrated `react-i18next` providing translations for English, Telugu, and Hindi.
- **Secure Authentication:** JWT-based protection with `bcrypt` encrypted passwords.

## Tech Stack

- **Frontend:** React, Vite, React Router DOM, Context API, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Security:** JSON Web Tokens (JWT)

## Getting Started

### Prerequisites
- Node.js (v18+)

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(The server will run on port 5000 and automatically create the SQLite database and default admin account).*

### 2. Frontend Setup
1. Open a **new** terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

## Default Admin Login
An admin account is automatically created on startup so you can access the Admin Dashboard.
- **Email:** `admin@hospital.com`
- **Password:** `admin123`

## Project Structure
- `/backend`: Contains the Express.js server, SQLite models, JWT middleware, and REST APIs.
- `/frontend`: Contains the React UI, Tailwind configurations, i18n localization files, and Context providers.
