import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Stethoscope, CalendarClock, Building2, BedDouble,
  Pill, FlaskConical, ClipboardList, Receipt, FileText, UserCog, BarChart3,
  Bell, Settings as SettingsIcon, HeartPulse, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import type { Role } from '../../types';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/appointments', label: 'Appointments', icon: CalendarClock },
  { to: '/departments', label: 'Departments', icon: Building2 },
  { to: '/beds', label: 'Beds', icon: BedDouble },
  { to: '/pharmacy', label: 'Pharmacy', icon: Pill },
  { to: '/laboratory', label: 'Laboratory', icon: FlaskConical },
  { to: '/prescriptions', label: 'Prescriptions', icon: ClipboardList },
  { to: '/billing', label: 'Billing', icon: Receipt },
  { to: '/medical-records', label: 'Medical Records', icon: FileText },
  { to: '/staff', label: 'Staff', icon: UserCog, roles: ['Admin'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['Admin', 'Doctor'] },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const items = NAV_ITEMS.filter((item) => !item.roles || (user && item.roles.includes(user.role)));

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-[rgb(var(--border))] bg-[rgb(var(--card))] transition-transform duration-200 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[rgb(var(--border))] px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <HeartPulse className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-[rgb(var(--text))]">MediCare</span>
          </div>
          <button onClick={onClose} className="text-[rgb(var(--muted))] lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 overflow-y-auto p-3" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-[rgb(var(--muted))] hover:bg-[rgb(var(--border))]/50 hover:text-[rgb(var(--text))]'
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
