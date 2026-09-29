import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X as XIcon } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const EMPTY = { name: '', category: 'wedding', description: '', capacity: '', image: '', facilities: [], is_active: 1 };
const CATEGORIES = ['wedding', 'birthday', 'corporate', 'conference', 'meeting', 'private'];

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [facilityInput, setFacilityInput] = useState('');
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get('/events', { params: { all: true } }).then((res) => setEvents(res.data.data)).finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(ev) { setEditing(ev); setForm({ ...ev, facilities: ev.facilities || [] }); setModalOpen(true); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.put(`/events/${editing.id}`, form);
      else await api.post('/events', form);
      setModalOpen(false);
      load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this event category?')) return;
    await api.delete(`/events/${id}`);
    load();
  }

  function addFacility() {
    if (!facilityInput.trim()) return;
    setForm((f) => ({ ...f, facilities: [...f.facilities, facilityInput.trim()] }));
    setFacilityInput('');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-charcoal-800">Manage Events</h1>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Event</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <div key={ev.id} className="card overflow-hidden">
              {ev.image && <img src={ev.image} alt={ev.name} className="h-36 w-full object-cover" />}
              <div className="p-4">
                <h3 className="font-semibold text-charcoal-800">{ev.name}</h3>
                <p className="text-xs capitalize text-charcoal-500">{ev.category} · {ev.capacity}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEdit(ev)} className="btn-secondary flex-1 !py-1.5 text-sm"><Pencil size={14} /> Edit</button>
                  <button onClick={() => handleDelete(ev.id)} className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Event' : 'Add Event'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label-field">Name *</label><input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div>
              <label className="label-field">Category</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="label-field">Capacity</label><input className="input-field" placeholder="e.g. Up to 200 guests" value={form.capacity || ''} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
            <div><label className="label-field">Image URL</label><input className="input-field" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
          </div>
          <div><label className="label-field">Description</label><textarea rows={3} className="input-field" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div>
            <label className="label-field">Facilities</label>
            <div className="flex gap-2">
              <input className="input-field" value={facilityInput} onChange={(e) => setFacilityInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFacility(); } }} />
              <button type="button" onClick={addFacility} className="btn-secondary shrink-0">Add</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.facilities.map((f, i) => (
                <span key={i} className="flex items-center gap-1 rounded-full bg-gold-50 px-3 py-1 text-xs text-gold-700">
                  {f} <button type="button" onClick={() => setForm({ ...form, facilities: form.facilities.filter((_, idx) => idx !== i) })}><XIcon size={12} /></button>
                </span>
              ))}
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Save Event'}</button>
        </form>
      </Modal>
    </div>
  );
}
