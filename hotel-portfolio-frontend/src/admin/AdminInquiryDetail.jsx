import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Globe, MessageSquare, Trash2, Save } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['new', 'contacted', 'in_progress', 'resolved', 'closed'];

export default function AdminInquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [inquiry, setInquiry] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get(`/inquiries/${id}`).then((res) => {
      setInquiry(res.data.data);
      setHistory(res.data.history);
      setNote(res.data.data.admin_notes || '');
    }).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function handleStatusChange(newStatus) {
    setStatusSaving(true);
    try {
      await api.put(`/inquiries/${id}/status`, { status: newStatus });
      load();
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleSaveNote() {
    setSaving(true);
    try {
      await api.post(`/inquiries/${id}/notes`, { note });
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this inquiry permanently? This cannot be undone.')) return;
    await api.delete(`/inquiries/${id}`);
    navigate('/admin/inquiries');
  }

  if (loading) return <LoadingSpinner />;
  if (!inquiry) return <p className="text-charcoal-500">Inquiry not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/admin/inquiries" className="flex items-center gap-2 text-sm font-medium text-charcoal-500 hover:text-gold-600">
          <ArrowLeft size={16} /> Back to Inquiries
        </Link>
        {admin?.role === 'super_admin' && (
          <button onClick={handleDelete} className="flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
            <Trash2 size={16} /> Delete
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-lg font-semibold text-gold-600">{inquiry.inquiry_reference}</h2>
              <select
                value={inquiry.status}
                disabled={statusSaving}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="input-field w-auto capitalize"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>

            <h3 className="mb-3 font-semibold text-charcoal-800">Customer Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-charcoal-600">
              <p><span className="text-charcoal-400">Name:</span> {inquiry.full_name}</p>
              <p className="flex items-center gap-1.5"><Mail size={14} className="text-gold-500" /> {inquiry.email}</p>
              <p className="flex items-center gap-1.5"><Phone size={14} className="text-gold-500" /> {inquiry.phone}</p>
              <p className="flex items-center gap-1.5"><Globe size={14} className="text-gold-500" /> {inquiry.country || '—'}</p>
              <p><span className="text-charcoal-400">Preferred Contact:</span> {inquiry.preferred_contact_method}</p>
              <p className="capitalize"><span className="text-charcoal-400">Type:</span> {inquiry.inquiry_type.replace('_', ' ')}</p>
            </div>

            {(inquiry.check_in_date || inquiry.room_type) && (
              <div className="mt-6 border-t border-charcoal-100 pt-4">
                <h3 className="mb-3 font-semibold text-charcoal-800">Stay Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-charcoal-600">
                  {inquiry.check_in_date && <p><span className="text-charcoal-400">Check-in:</span> {inquiry.check_in_date}</p>}
                  {inquiry.check_out_date && <p><span className="text-charcoal-400">Check-out:</span> {inquiry.check_out_date}</p>}
                  {inquiry.adults != null && <p><span className="text-charcoal-400">Adults:</span> {inquiry.adults}</p>}
                  {inquiry.children != null && <p><span className="text-charcoal-400">Children:</span> {inquiry.children}</p>}
                  {inquiry.room_type && <p><span className="text-charcoal-400">Room Type:</span> {inquiry.room_type}</p>}
                  {inquiry.number_of_rooms && <p><span className="text-charcoal-400">Rooms:</span> {inquiry.number_of_rooms}</p>}
                </div>
              </div>
            )}

            {(inquiry.event_type || inquiry.event_date) && (
              <div className="mt-6 border-t border-charcoal-100 pt-4">
                <h3 className="mb-3 font-semibold text-charcoal-800">Event Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-charcoal-600">
                  {inquiry.event_type && <p><span className="text-charcoal-400">Event Type:</span> {inquiry.event_type}</p>}
                  {inquiry.event_date && <p><span className="text-charcoal-400">Event Date:</span> {inquiry.event_date}</p>}
                  {inquiry.number_of_guests && <p><span className="text-charcoal-400">Guests:</span> {inquiry.number_of_guests}</p>}
                  {inquiry.venue_preference && <p><span className="text-charcoal-400">Venue:</span> {inquiry.venue_preference}</p>}
                </div>
              </div>
            )}

            {inquiry.message && (
              <div className="mt-6 border-t border-charcoal-100 pt-4">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-charcoal-800"><MessageSquare size={16} /> Customer Message</h3>
                <p className="whitespace-pre-wrap rounded-lg bg-charcoal-50 p-4 text-sm text-charcoal-600">{inquiry.message}</p>
              </div>
            )}
          </div>

          <div className="card p-6">
            <h3 className="mb-3 font-semibold text-charcoal-800">Internal Admin Notes</h3>
            <textarea rows={4} className="input-field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add internal notes about this inquiry..." />
            <button onClick={handleSaveNote} disabled={saving} className="btn-primary mt-3">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 font-semibold text-charcoal-800">Activity History</h3>
          <ul className="space-y-4 border-l-2 border-charcoal-100 pl-4">
            {history.map((h) => (
              <li key={h.id} className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-gold-500" />
                <p className="text-sm font-medium text-charcoal-800">{h.action}</p>
                {h.note && <p className="text-xs text-charcoal-500">{h.note}</p>}
                <p className="text-xs text-charcoal-400">
                  {new Date(h.created_at).toLocaleString()} {h.admin_name ? `· ${h.admin_name}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
