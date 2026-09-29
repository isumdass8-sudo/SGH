import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const EMPTY = { customer_name: '', rating: 5, comment: '', testimonial_date: '', is_active: 1 };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get('/testimonials', { params: { all: true } }).then((res) => setItems(res.data.data)).finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(t) { setEditing(t); setForm(t); setModalOpen(true); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.put(`/testimonials/${editing.id}`, form);
      else await api.post('/testimonials', form);
      setModalOpen(false);
      load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this testimonial?')) return;
    await api.delete(`/testimonials/${id}`);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-charcoal-800">Manage Testimonials</h1>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Testimonial</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <div key={t.id} className="card p-5">
              <div className="flex gap-1 text-gold-500">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="mt-2 line-clamp-3 text-sm italic text-charcoal-600">"{t.comment}"</p>
              <p className="mt-3 text-sm font-semibold text-charcoal-800">{t.customer_name}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => openEdit(t)} className="btn-secondary flex-1 !py-1.5 text-sm"><Pencil size={14} /> Edit</button>
                <button onClick={() => handleDelete(t.id)} className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label-field">Customer Name *</label><input required className="input-field" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} /></div>
            <div>
              <label className="label-field">Rating</label>
              <select className="input-field" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
            <div><label className="label-field">Date</label><input type="date" className="input-field" value={form.testimonial_date || ''} onChange={(e) => setForm({ ...form, testimonial_date: e.target.value })} /></div>
          </div>
          <div><label className="label-field">Comment *</label><textarea required rows={3} className="input-field" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} /></div>
          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Save Testimonial'}</button>
        </form>
      </Modal>
    </div>
  );
}
