import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_COLORS = { new: 'bg-gold-500', contacted: 'bg-indigo-500', in_progress: 'bg-amber-500', resolved: 'bg-green-500', closed: 'bg-charcoal-500' };
const STATUSES = ['new', 'contacted', 'in_progress', 'resolved', 'closed'];
const TYPES = ['room', 'wedding_event', 'restaurant', 'corporate', 'conference', 'general', 'other'];

export default function AdminInquiries() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', inquiry_type: '', date_from: '', date_to: '', page: 1 });

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api.get('/inquiries', { params }).then((res) => {
      setData(res.data.data);
      setPagination(res.data.pagination);
    }).finally(() => setLoading(false));
  }, [filters]);

  function update(field, value) {
    setFilters((f) => ({ ...f, [field]: value, page: field === 'page' ? value : 1 }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-charcoal-800">Customer Inquiries</h1>
        <p className="text-sm text-charcoal-500">{pagination.total} total inquiries</p>
      </div>

      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" size={16} />
          <input
            className="input-field pl-9"
            placeholder="Search name, email, phone, reference..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
          />
        </div>
        <select className="input-field w-auto" value={filters.status} onChange={(e) => update('status', e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <select className="input-field w-auto" value={filters.inquiry_type} onChange={(e) => update('inquiry_type', e.target.value)}>
          <option value="">All Types</option>
          {TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
        </select>
        <input type="date" className="input-field w-auto" value={filters.date_from} onChange={(e) => update('date_from', e.target.value)} title="From date" />
        <input type="date" className="input-field w-auto" value={filters.date_to} onChange={(e) => update('date_to', e.target.value)} title="To date" />
      </div>

      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner /> : data.length === 0 ? (
          <p className="p-8 text-center text-charcoal-500">No inquiries match your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-charcoal-50">
                <tr className="text-charcoal-500">
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((inq) => (
                  <tr key={inq.id} className="border-t border-charcoal-100 hover:bg-charcoal-50">
                    <td className="px-4 py-3 font-mono text-gold-600">{inq.inquiry_reference}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal-800">{inq.full_name}</p>
                      <p className="text-xs text-charcoal-500">{inq.email}</p>
                    </td>
                    <td className="px-4 py-3 capitalize">{inq.inquiry_type.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium text-white ${STATUS_COLORS[inq.status]}`}>
                        {inq.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal-500">{new Date(inq.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/inquiries/${inq.id}`} className="text-sm font-medium text-gold-600 hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-charcoal-100 px-4 py-3">
            <p className="text-xs text-charcoal-500">Page {pagination.page} of {pagination.totalPages}</p>
            <div className="flex gap-2">
              <button disabled={pagination.page <= 1} onClick={() => update('page', pagination.page - 1)} className="rounded-lg border border-charcoal-200 p-2 disabled:opacity-40">
                <ChevronLeft size={16} />
              </button>
              <button disabled={pagination.page >= pagination.totalPages} onClick={() => update('page', pagination.page + 1)} className="rounded-lg border border-charcoal-200 p-2 disabled:opacity-40">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
