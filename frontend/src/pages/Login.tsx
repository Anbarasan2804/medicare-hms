import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@medicare.com' },
  { role: 'Doctor', email: 'priya.sharma@medicare.com' },
  { role: 'Nurse', email: 'lakshmi.iyer@medicare.com' },
  { role: 'Receptionist', email: 'sneha.patil@medicare.com' },
  { role: 'Patient', email: 'anitha.reddy@medicare.com' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back!', 'success');
      navigate('/');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4 dark:from-[#0f1115] dark:to-[#0f1115]">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg">
            <HeartPulse className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-[rgb(var(--text))]">MediCare HMS</h1>
          <p className="text-sm text-[rgb(var(--muted))]">Hospital Management System</p>
        </div>

        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[rgb(var(--text))]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--muted))]" />
                <Input
                  type="email"
                  required
                  placeholder="you@medicare.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[rgb(var(--text))]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--muted))]" />
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" loading={loading} size="lg" className="mt-2 w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </Button>
          </form>
        </div>

        <div className="mt-5 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 text-xs">
          <p className="mb-2 font-semibold text-[rgb(var(--text))]">Demo accounts (password: Password@123)</p>
          <div className="grid grid-cols-1 gap-1">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => {
                  setEmail(acc.email);
                  setPassword('Password@123');
                }}
                className="flex justify-between rounded-md px-2 py-1.5 text-left text-[rgb(var(--muted))] hover:bg-[rgb(var(--border))]/40"
              >
                <span className="font-medium text-[rgb(var(--text))]">{acc.role}</span>
                <span>{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
