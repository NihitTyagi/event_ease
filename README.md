# 🎉 EventEase - Full-Stack Event Booking Platform

## 📌 Project Overview

**EventEase** is a full-stack web application designed as a central hub for discovering, booking, and managing events.  
It provides a seamless experience for:

- 👥 **Public users** to browse and filter events.
- 👤 **Registered users** to book and manage their bookings.
- 🛡️ **Administrators** to manage the entire event lifecycle via a dashboard.

The platform supports **role-based access control**, ensuring tailored experiences based on user roles.

---

## ✨ Features Implemented

### 👤 Public User Features

- 🔍 **Browse & Filter Events**  
  View a comprehensive list of available events.

- ⚙️ **Dynamic Filtering**  
  Filter events by **Category**, **Location (Online/In-Person)**, and **Date** in real-time.

- 🔐 **User Authentication**  
  Register a new account or log in to an existing one.

---

### 🧑‍💻 Registered User Features

- 🔑 **Secure Login**  
  JWT-based authentication system.

- 🎟️ **Event Booking**  
  Book up to **2 seats** for any upcoming event (if not full).

- 📋 **View My Bookings**  
  View all your confirmed bookings on the `/my-bookings` dashboard page.

- ❌ **Cancel Bookings**  
  Cancel any booking for events that have not yet started.

---

### 🛡️ Admin Features

- 📊 **Admin Dashboard**  
  Access a protected admin area at `/admin`.

- 🛠️ **Full CRUD for Events**  
  Create, Read, Update, and Delete events.

- 🆔 **Custom Event ID Generation**  
  Format: `EVT-[MMM][YYYY]-[Random3]` (e.g., `EVT-AUG2025-X4T`).

- 📅 **Dynamic Event Status**  
  Events are labeled as **Upcoming**, **Ongoing**, or **Completed** based on the current date.

- 👥 **View Event Attendees**  
  See a full list of attendees for each event.

- 📝 **Custom Logging Middleware**  
  Logs each new booking with user and timestamp to the server console.

---

## 🧰 Tech Stack Used

### 🔧 Frontend

- ⚛️ **React** — UI Library  
- 🛠️ **Redux Toolkit** — State management  
- 🧭 **React Router** — Routing  
- 🎨 **Tailwind CSS** — Styling  
- 🌐 **Axios** — HTTP requests  
- 🎯 **Lucide React** — Icons  

### ⚙️ Backend

- 🟢 **Node.js** — JavaScript runtime  
- 🚂 **Express.js** — Server framework  
- 🍃 **Mongoose** — ODM for MongoDB  

### 💾 Database

- 🗃️ **MongoDB** — NoSQL database  

### 🔐 Authentication

- 🔑 **JWT (JSON Web Tokens)** — API route protection & session management  
- 🧂 **bcrypt.js** — Password hashing  

---

## 🚀 Setup and Installation

### 📁 Backend Setup

1. **Navigate to Backend Directory**  
   ```bash
   cd eventease-backend
   ```

2. **Create `.env` File**  
   In the root directory, create a `.env` file with the following:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=<Your_MongoDB_Connection_String>
   JWT_SECRET=<Your_Super_Secret_JWT_Key>
   ```

3. **Install Dependencies**  
   ```bash
   npm install
   ```

4. **Run Backend Server**  
   ```bash
   npm run dev
   ```
   Server will start at: `http://localhost:5000`

---

### 🌐 Frontend Setup

1. **Navigate to Frontend Directory**  
   ```bash
   cd eventease-frontend
   ```

2. **Install Dependencies**  
   If you face issues, first clean cache and remove old modules:

   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Run Frontend Server**  
   ```bash
   npm start
   ```
   App will run at: `http://localhost:3000`