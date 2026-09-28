# MediCare — Hospital Management System

A full-stack Hospital Management System built for a college project, with a
React + TypeScript frontend and a Node.js/Express + MySQL REST API backend.

## ✨ Features

- **JWT authentication** with **bcrypt**-hashed passwords
- **Role-based access control** — Admin, Doctor, Nurse, Receptionist, Patient
- Responsive dashboard with **light/dark mode**, collapsible sidebar, and charts (Recharts)
- **15 modules**: Dashboard, Patients, Doctors, Appointments, Departments, Beds,
  Pharmacy, Laboratory, Prescriptions, Billing, Medical Records, Staff, Reports,
  Notifications, Settings
- Full **CRUD** on every module — create, read, update, delete — with:
  - Search, pagination, sortable tables
  - Modal forms with validation
  - Delete confirmation dialogs
  - Toast notifications for every action
- Protected routes on the frontend + role-checked routes on the backend
- Realistic seed data: patients, doctors, appointments, medicines, lab tests, invoices
- Clean, reusable component architecture (a single generic `CrudPage` component
  powers all 12 CRUD modules, driven by a per-module config file)

## 🧱 Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, React Router, Axios
**Backend:** Node.js, Express, MySQL (mysql2), JWT, bcryptjs, express-validator, Helmet, CORS, Morgan

## 📁 Project Structure

```
medicare-hms/
├── backend/
│   ├── src/
│   │   ├── config/db.js            # MySQL connection pool
│   │   ├── controllers/            # authController + generic CRUD factory
│   │   ├── middleware/             # JWT auth, role authorization, error handler
│   │   ├── routes/                 # auth, dashboard, and per-module routes
│   │   ├── db/
│   │   │   ├── schema.sql          # table definitions
│   │   │   ├── seed.sql            # demo data
│   │   │   └── runSeed.js          # runs schema + seed against your DB
│   │   └── server.js               # app entry point
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/                 # Button, Input, Card, Modal, Table, Badge…
    │   │   ├── layout/              # Sidebar, Topbar, DashboardLayout
    │   │   ├── charts/              # ChartCard wrapper for Recharts
    │   │   └── CrudPage.tsx         # generic list/search/CRUD component
    │   ├── config/modules.ts        # field/column/permission config per module
    │   ├── context/                 # Auth, Theme, Toast providers
    │   ├── pages/                   # one file per route
    │   ├── lib/                     # axios instance, utils
    │   └── App.tsx
    ├── package.json
    └── tailwind.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+ (or MariaDB) running locally

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your MySQL credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=medicare_hms
JWT_SECRET=replace_with_a_long_random_string
```

Create and seed the database (this creates the `medicare_hms` database, all
tables, and realistic demo data):

```bash
npm run seed
```

Start the API server:

```bash
npm run dev      # with nodemon, auto-restarts on changes
# or
npm start
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health`.

### 2. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api` requests to the
backend automatically (see `vite.config.ts`).

### 3. Log in

Use any of the seeded demo accounts — click one on the login screen to
auto-fill it, or type manually. **Password for every account: `Password@123`**

| Role         | Email                          |
|--------------|---------------------------------|
| Admin        | admin@medicare.com              |
| Doctor       | priya.sharma@medicare.com       |
| Nurse        | lakshmi.iyer@medicare.com       |
| Receptionist | sneha.patil@medicare.com        |
| Patient      | anitha.reddy@medicare.com       |

## 🔐 Roles & Permissions

Each module declares which roles can **view**, **write** (create/update), and
**delete** its records (see `backend/src/routes/moduleConfig.js` and
`frontend/src/config/modules.ts`). For example:

- **Admin** — full access everywhere
- **Doctor** — can write prescriptions & medical records, update appointments/lab tests
- **Nurse** — can manage beds, update patients, lab tests
- **Receptionist** — can manage patients, appointments, billing
- **Patient** — read-only across modules

The backend enforces this on every route with `protect` (JWT check) and
`authorize(...roles)` middleware — the frontend also hides buttons a role
can't use, but the **backend is the real enforcement layer**.

## 🗄️ Database Schema

See `backend/src/db/schema.sql` for the full schema. Core tables: `users`,
`patients`, `doctors`, `departments`, `appointments`, `beds`, `medicines`,
`lab_tests`, `prescriptions`, `billing`, `medical_records`, `staff`,
`notifications`.

## 📡 API Overview

All endpoints are prefixed with `/api` and (except `/auth/login`,
`/auth/register`) require an `Authorization: Bearer <token>` header.

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me
PUT    /api/auth/change-password

GET    /api/dashboard/stats
GET    /api/dashboard/reports        (Admin, Doctor)

GET    /api/patients?page=&limit=&search=
GET    /api/patients/:id
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id
```

The same 5 REST verbs are available for every module:
`patients`, `doctors`, `appointments`, `departments`, `beds`, `medicines`,
`lab-tests`, `prescriptions`, `billing`, `medical-records`, `staff`,
`notifications`.

## 🛡️ Security Notes

- Passwords are hashed with **bcrypt** (10 salt rounds) — never stored in plain text
- Auth uses **JWT** with a configurable expiry (`JWT_EXPIRES_IN`)
- All CRUD queries use **parameterized SQL** (via `mysql2`) — no string-concatenated queries
- **Helmet** sets secure HTTP headers; **CORS** is restricted to the configured frontend origin
- Table/column names touched by the CRUD layer come only from server-side
  config (`moduleConfig.js`), never from client input

## 🧪 Verified

This project was built and verified end-to-end during development:
MySQL schema + seed applied successfully, the API was exercised live
(login, wrong-password rejection, role-based 403s, missing-token 401s,
paginated/searchable listing, record creation), the frontend passed a
full TypeScript build (`tsc -b`) and a production `vite build` with zero
errors, and the Vite dev server's `/api` proxy was confirmed working
against the live backend.

## 📝 Notes for Extending

- To add a new module: add one entry to `backend/src/routes/moduleConfig.js`
  (table + fields + role permissions) and one to
  `frontend/src/config/modules.ts` (fields + table columns) — the generic
  CRUD controller and `CrudPage` component do the rest.
- To wire real-time notifications, sockets, file uploads (e.g. patient
  documents, doctor photos), or PDF invoice generation, those are natural
  next steps not included in this scope.

## 📄 License

Built for educational/college project use. Feel free to adapt it.
