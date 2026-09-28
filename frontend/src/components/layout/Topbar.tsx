import React, { useState } from 'react';
import { Menu, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { initials } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export function Topbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-md p-2 text-[rgb(var(--muted))] hover:bg-[rgb(var(--border))]/50 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-[rgb(var(--text))]">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-[rgb(var(--muted))] hover:bg-[rgb(var(--border))]/50"
          title="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[rgb(var(--border))]/50"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: user?.avatarColor || '#2563eb' }}
            >
              {user ? initials(user.name) : '?'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-[rgb(var(--text))]">{user?.name}</p>
              <p className="text-xs text-[rgb(var(--muted))]">{user?.role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-[rgb(var(--muted))]" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-lg">
                <button
                  onClick={() => { setMenuOpen(false); navigate('/settings'); }}
                  className="block w-full px-4 py-2.5 text-left text-sm text-[rgb(var(--text))] hover:bg-[rgb(var(--border))]/40"
                >
                  Settings
                </button>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
