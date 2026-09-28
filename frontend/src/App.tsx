import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Departments from './pages/Departments';
import Beds from './pages/Beds';
import Pharmacy from './pages/Pharmacy';
import Laboratory from './pages/Laboratory';
import Prescriptions from './pages/Prescriptions';
import Billing from './pages/Billing';
import MedicalRecords from './pages/MedicalRecords';
import Staff from './pages/Staff';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

function LoginRoute() {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return <Login />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/beds" element={<Beds />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/laboratory" element={<Laboratory />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route
          path="/staff"
          element={
            <ProtectedRoute roles={['Admin']}>
              <Staff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={['Admin', 'Doctor']}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
