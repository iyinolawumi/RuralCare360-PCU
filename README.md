# RuralCare360 🏥

A web-based telemedicine and health records management system designed to improve primary healthcare delivery in rural Nigeria.

---

## 📌 About the Project

RuralCare360 bridges the healthcare access gap in rural Nigerian communities by providing:

- **Telemedicine consultations** — patients consult health workers remotely via real-time chat
- **Digital health records** — patient medical history, diagnoses and prescriptions stored securely
- **Appointment scheduling** — patients book and manage appointments online
- **Referral management** — health workers create structured referrals to specialist facilities
- **NHIS integration** — automatic NHIS ID generation for every registered patient
- **Role-based access** — separate dashboards for patients, health workers and admins

---

## 🛠️ Tech Stack

### Backend
- **Node.js** — server-side JavaScript runtime
- **Express.js** — web framework for REST API
- **MongoDB Atlas** — cloud NoSQL database
- **Mongoose** — ODM for MongoDB schema management
- **JWT + bcryptjs** — authentication and password hashing
- **Socket.io** — real-time consultation chat

### Frontend

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/iyinolawumi/RuralCare360.git
cd RuralCare360
```

**2. Set up the backend:**
```bash
cd server
npm install
```

**3. Create your `.env` file inside the `server` folder:**
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

**4. Run the backend:**
```bash
npm run dev
```


The backend runs on `http://localhost:5000` and the frontend on `http://localhost:8080`.

---

## 📁 Project Structure

```

│
└── server/                  # Node.js/Express.js backend
    ├── controllers/         # Business logic
    ├── middleware/          # Auth and RBAC middleware
    ├── models/              # Mongoose schemas
    ├── routes/              # API route definitions
    ├── utils/               # Helper functions
    └── server.js            # Entry point
```

---

## 🔐 User Roles

| Role | Description |
|---|---|
| `patient` | Register, manage health records, book appointments, consult health workers |
| `healthworker` | Manage patients, conduct consultations, create referrals |
| `admin` | System oversight, user management, NHIS verification, analytics |

---

## 📡 API Overview

Base URL: `http://localhost:5000/api`

| Module | Base Route | Endpoints |
|---|---|---|
| Authentication | `/api/auth` | 3 |
| Patients | `/api/patients` | 8 |
| Appointments | `/api/appointments` | 7 |
| Consultations | `/api/consultations` | 4 |
| Referrals | `/api/referrals` | 7 |
| Admin + NHIS | `/api/admin` | 9 |
| **Total** | | **38** |


- GitHub: [@iyinolawumi](https://github.com/iyinolawumi)

---

## 📄 License

This project was developed as a final year capstone project. All rights reserved © 2025.