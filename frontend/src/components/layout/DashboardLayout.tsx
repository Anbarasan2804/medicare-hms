import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/patients': 'Patients',
  '/doctors': 'Doctors',
  '/appointments': 'Appointments',
  '/departments': 'Departments',
  '/beds': 'Bed Management',
  '/pharmacy': 'Pharmacy',
  '/laboratory': 'Laboratory',
  '/prescriptions': 'Prescriptions',
  '/billing': 'Billing',
  '/medical-records': 'Medical Records',
  '/staff': 'Staff',
  '/reports': 'Reports',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
};

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] || 'MediCare HMS';

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
