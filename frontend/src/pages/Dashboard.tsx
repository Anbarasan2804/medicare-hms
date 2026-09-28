import React, { useEffect, useState } from 'react';
import {
  Users, Stethoscope, CalendarClock, BedDouble, IndianRupee, AlertTriangle,
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import api from '../lib/axios';
import { Card, CardContent } from '../components/ui/Card';
import { ChartCard } from '../components/charts/ChartCard';
import { formatCurrency } from '../lib/utils';
import { useToast } from '../context/ToastContext';

interface Stats {
  kpis: {
    totalPatients: number;
    totalDoctors: number;
    appointmentsToday: number;
    bedsAvailable: number;
    bedsTotal: number;
    totalRevenue: number;
    pendingBills: number;
  };
  appointmentsByStatus: { status: string; count: number }[];
  patientsByDepartment: { department: string; count: number }[];
  revenueByMonth: { month: string; total: number }[];
  lowStockMedicines: { id: number; name: string; stock_quantity: number; reorder_level: number }[];
}

const PIE_COLORS = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

function KpiCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  tone: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-[rgb(var(--muted))]">{label}</p>
          <p className="text-xl font-bold text-[rgb(var(--text))]">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data.data);
      } catch (err: any) {
        showToast(err.response?.data?.message || 'Failed to load dashboard', 'error');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-sm text-[rgb(var(--muted))]">Loading dashboard…</div>;
  }
  if (!stats) {
    return <div className="py-20 text-center text-sm text-[rgb(var(--muted))]">No data available.</div>;
  }

  const { kpis } = stats;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={Users} label="Total Patients" value={kpis.totalPatients} tone="bg-blue-100 text-blue-600 dark:bg-blue-500/15" />
        <KpiCard icon={Stethoscope} label="Total Doctors" value={kpis.totalDoctors} tone="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15" />
        <KpiCard icon={CalendarClock} label="Appointments Today" value={kpis.appointmentsToday} tone="bg-amber-100 text-amber-600 dark:bg-amber-500/15" />
        <KpiCard
          icon={BedDouble}
          label="Beds Available"
          value={`${kpis.bedsAvailable} / ${kpis.bedsTotal}`}
          tone="bg-purple-100 text-purple-600 dark:bg-purple-500/15"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard icon={IndianRupee} label="Revenue Collected" value={formatCurrency(kpis.totalRevenue)} tone="bg-teal-100 text-teal-600 dark:bg-teal-500/15" />
        <KpiCard icon={AlertTriangle} label="Pending / Overdue Bills" value={kpis.pendingBills} tone="bg-red-100 text-red-600 dark:bg-red-500/15" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Revenue Trend (last 6 months)">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
              <XAxis dataKey="month" fontSize={12} stroke="currentColor" />
              <YAxis fontSize={12} stroke="currentColor" />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Appointments by Status">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={stats.appointmentsByStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry) => `${entry.status}: ${entry.count}`}
              >
                {stats.appointmentsByStatus.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Patients by Department" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.patientsByDepartment}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
              <XAxis dataKey="department" fontSize={12} stroke="currentColor" />
              <YAxis fontSize={12} stroke="currentColor" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {stats.lowStockMedicines.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-semibold">Low Stock Alerts</h3>
            </div>
            <ul className="flex flex-col gap-2">
              {stats.lowStockMedicines.map((m) => (
                <li key={m.id} className="flex justify-between rounded-lg bg-amber-500/10 px-3 py-2 text-sm">
                  <span className="text-[rgb(var(--text))]">{m.name}</span>
                  <span className="text-[rgb(var(--muted))]">
                    {m.stock_quantity} left (reorder at {m.reorder_level})
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
