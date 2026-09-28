import React, { useState } from 'react';
import { Sun, Moon, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import api from '../lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { initials } from '../lib/utils';

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      showToast('Password updated successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold text-white"
            style={{ backgroundColor: user?.avatarColor || '#2563eb' }}
          >
            {user ? initials(user.name) : <User />}
          </div>
          <div>
            <p className="text-base font-semibold text-[rgb(var(--text))]">{user?.name}</p>
            <p className="text-sm text-[rgb(var(--muted))]">{user?.email}</p>
            <p className="mt-1 inline-block rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-500/15 dark:text-primary-400">
              {user?.role}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-lg border border-[rgb(var(--border))] px-4 py-3 hover:bg-[rgb(var(--border))]/30"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--text))]">
              {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </span>
            <span className="text-xs text-[rgb(var(--muted))]">Click to toggle</span>
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[rgb(var(--text))]">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--muted))]" />
                <Input
                  type="password"
                  required
                  className="pl-9"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[rgb(var(--text))]">New Password</label>
              <Input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[rgb(var(--text))]">Confirm New Password</label>
              <Input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" loading={saving} className="self-start">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
