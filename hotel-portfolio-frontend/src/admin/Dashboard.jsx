import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, MessageCircle, Loader, CheckCircle2, XCircle, CalendarClock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_COLORS = { new: '#c4903a', contacted: '#4d5563', in_progress: '#deb96b', resolved: '#3a404c', closed: '#9aa1ab' };
const CARD_CONFIG = [
  { key: 'total', label: 'Total Inquiries', icon: Inbox, color: 'bg-gold-500' },
  { key: 'new_count', label: 'New', icon: MessageCircle, color: 'bg-blue-500' },
  { key: 'contacted_count', label: 'Contacted', icon: MessageCircle, color: 'bg-indigo-500' },
  { key: 'in_progress_count', label: 'In Progress', icon: Loader, color: 'bg-amber-500' },
  { key: 'resolved_count', label: 'Resolved', icon: CheckCircle2, color: 'bg-green-500' },
  { key: 'closed_count', label: 'Closed', icon: XCircle, color: 'bg-charcoal-500' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/inquiries/stats/summary').then((res) => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <p className="text-charcoal-500">Unable to load dashboard data.</p>;

  const pieData = stats.byType.map((t) => ({ name: t.inquiry_type.replace('_', ' '), value: Number(t.count) }));
  const PIE_COLORS = ['#c4903a', '#4d5563', '#deb96b', '#3a404c', '#9aa1ab', '#7f5a29', '#a3722f'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-charcoal-800">Dashboard Overview</h1>
        <p className="text-sm text-charcoal-500">Today: {stats.totals.today_count || 0} new inquiries</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {CARD_CONFIG.map((c) => (
          <div key={c.key} className="card p-5">
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg text-white ${c.color}`}>
              <c.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-charcoal-800">{stats.totals[c.key] || 0}</p>
            <p className="text-xs text-charcoal-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-charcoal-800">Inquiries — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.last7days}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e6e8" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#c4903a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 font-semibold text-charcoal-800">By Inquiry Type</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-charcoal-800">Recent Inquiries</h3>
          <Link to="/admin/inquiries" className="text-sm font-medium text-gold-600 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal-100 text-charcoal-500">
                <th className="pb-2">Reference</th>
                <th className="pb-2">Name</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 flex items-center gap-1"><CalendarClock size={14} /> Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((r) => (
                <tr key={r.id} className="border-b border-charcoal-50 hover:bg-charcoal-50">
                  <td className="py-2.5"><Link to={`/admin/inquiries/${r.id}`} className="font-mono text-gold-600 hover:underline">{r.inquiry_reference}</Link></td>
                  <td className="py-2.5">{r.full_name}</td>
                  <td className="py-2.5 capitalize">{r.inquiry_type.replace('_', ' ')}</td>
                  <td className="py-2.5">
                    <span className="rounded-full px-2.5 py-1 text-xs font-medium text-white" style={{ backgroundColor: STATUS_COLORS[r.status] }}>
                      {r.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 text-charcoal-500">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
