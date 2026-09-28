import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../lib/axios';
import { ChartCard } from '../components/charts/ChartCard';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../lib/utils';
import { useToast } from '../context/ToastContext';

interface ReportsData {
  billingByStatus: { status: string; count: number; total: number }[];
  bedOccupancyByDepartment: { department: string; occupied: number; total: number }[];
  doctorPerformance: { doctor: string; specialization: string; totalAppointments: number; completed: number }[];
  labTestsByStatus: { status: string; count: number }[];
}

export default function Reports() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/dashboard/reports');
        setData(data.data);
      } catch (err: any) {
        showToast(err.response?.data?.message || 'Failed to load reports', 'error');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exportCSV() {
    if (!data) return;
    const rows = [
      ['Doctor', 'Specialization', 'Total Appointments', 'Completed'],
      ...data.doctorPerformance.map((d) => [d.doctor, d.specialization, d.totalAppointments, d.completed]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'doctor-performance-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="py-20 text-center text-sm text-[rgb(var(--muted))]">Loading reports…</div>;
  if (!data) return <div className="py-20 text-center text-sm text-[rgb(var(--muted))]">No report data available.</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button variant="outline" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Export Doctor Report (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Billing by Status">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.billingByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
              <XAxis dataKey="status" fontSize={12} stroke="currentColor" />
              <YAxis fontSize={12} stroke="currentColor" />
              <Tooltip formatter={(v: number, name: string) => (name === 'total' ? formatCurrency(v) : v)} />
              <Legend />
              <Bar dataKey="count" name="Invoices" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="total" name="Amount (₹)" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Bed Occupancy by Department">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.bedOccupancyByDepartment}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
              <XAxis dataKey="department" fontSize={12} stroke="currentColor" />
              <YAxis fontSize={12} stroke="currentColor" allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="occupied" name="Occupied" fill="#dc2626" radius={[6, 6, 0, 0]} />
              <Bar dataKey="total" name="Total Beds" fill="#93c5fd" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card>
        <CardContent className="p-5">
          <h3 className="mb-4 font-semibold text-[rgb(var(--text))]">Doctor Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgb(var(--border))] text-left text-xs uppercase text-[rgb(var(--muted))]">
                  <th className="px-3 py-2">Doctor</th>
                  <th className="px-3 py-2">Specialization</th>
                  <th className="px-3 py-2">Total Appointments</th>
                  <th className="px-3 py-2">Completed</th>
                </tr>
              </thead>
              <tbody>
                {data.doctorPerformance.map((d, i) => (
                  <tr key={i} className="border-b border-[rgb(var(--border))] last:border-0">
                    <td className="px-3 py-2 text-[rgb(var(--text))]">{d.doctor}</td>
                    <td className="px-3 py-2 text-[rgb(var(--muted))]">{d.specialization}</td>
                    <td className="px-3 py-2 text-[rgb(var(--text))]">{d.totalAppointments}</td>
                    <td className="px-3 py-2 text-[rgb(var(--text))]">{d.completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h3 className="mb-3 font-semibold text-[rgb(var(--text))]">Lab Tests by Status</h3>
          <div className="flex flex-wrap gap-3">
            {data.labTestsByStatus.map((l, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-[rgb(var(--border))] px-3 py-2">
                <Badge value={l.status} />
                <span className="text-sm font-medium text-[rgb(var(--text))]">{l.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
