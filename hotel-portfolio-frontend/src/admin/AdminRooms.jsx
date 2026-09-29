import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X as XIcon } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const EMPTY = {
  name: '', description: '', max_guests: 2, bed_type: '', room_size: '', room_view: '',
  price_display: '', main_image: '', facilities: [], gallery: [], is_active: 1, display_order: 0
};

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [facilityInput, setFacilityInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get('/rooms', { params: { all: true } }).then((res) => setRooms(res.data.data)).finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(room) {
    setEditing(room);
    setForm({ ...room, facilities: room.facilities || [], gallery: room.gallery || [] });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.put(`/rooms/${editing.id}`, form);
      else await api.post('/rooms', form);
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this room? This cannot be undone.')) return;
    await api.delete(`/rooms/${id}`);
    load();
  }

  function addFacility() {
    if (!facilityInput.trim()) return;
    setForm((f) => ({ ...f, facilities: [...f.facilities, facilityInput.trim()] }));
    setFacilityInput('');
  }
  function addImage() {
    if (!imageInput.trim()) return;
    setForm((f) => ({ ...f, gallery: [...f.gallery, imageInput.trim()] }));
    setImageInput('');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-charcoal-800">Manage Rooms</h1>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Room</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((r) => (
            <div key={r.id} className="card overflow-hidden">
              <img src={r.main_image} alt={r.name} className="h-40 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-charcoal-800">{r.name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-charcoal-100 text-charcoal-500'}`}>
                    {r.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-charcoal-500">{r.max_guests} guests · {r.bed_type}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEdit(r)} className="btn-secondary flex-1 !py-1.5 text-sm"><Pencil size={14} /> Edit</button>
                  <button onClick={() => handleDelete(r.id)} className="rounded-full border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Room' : 'Add Room'} maxWidth="max-w-3xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label-field">Room Name *</label><input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="label-field">Main Image URL</label><input className="input-field" value={form.main_image} onChange={(e) => setForm({ ...form, main_image: e.target.value })} /></div>
            <div><label className="label-field">Max Guests</label><input type="number" className="input-field" value={form.max_guests} onChange={(e) => setForm({ ...form, max_guests: e.target.value })} /></div>
            <div><label className="label-field">Bed Type</label><input className="input-field" value={form.bed_type} onChange={(e) => setForm({ ...form, bed_type: e.target.value })} /></div>
            <div><label className="label-field">Room Size</label><input className="input-field" value={form.room_size} onChange={(e) => setForm({ ...form, room_size: e.target.value })} /></div>
            <div><label className="label-field">View</label><input className="input-field" value={form.room_view} onChange={(e) => setForm({ ...form, room_view: e.target.value })} /></div>
            <div><label className="label-field">Display Price (optional)</label><input className="input-field" value={form.price_display} onChange={(e) => setForm({ ...form, price_display: e.target.value })} /></div>
            <div>
              <label className="label-field">Status</label>
              <select className="input-field" value={form.is_active} onChange={(e) => setForm({ ...form, is_active: Number(e.target.value) })}>
                <option value={1}>Active (visible)</option>
                <option value={0}>Hidden</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Description</label>
            <textarea rows={3} className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div>
            <label className="label-field">Facilities</label>
            <div className="flex gap-2">
              <input className="input-field" value={facilityInput} onChange={(e) => setFacilityInput(e.target.value)} placeholder="e.g. Free Wi-Fi" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFacility(); } }} />
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

          <div>
            <label className="label-field">Gallery Images (additional URLs)</label>
            <div className="flex gap-2">
              <input className="input-field" value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="https://..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }} />
              <button type="button" onClick={addImage} className="btn-secondary shrink-0">Add</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.gallery.map((g, i) => (
                <span key={i} className="flex items-center gap-1 rounded-full bg-charcoal-100 px-3 py-1 text-xs text-charcoal-600">
                  Image {i + 1} <button type="button" onClick={() => setForm({ ...form, gallery: form.gallery.filter((_, idx) => idx !== i) })}><XIcon size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Save Room'}</button>
        </form>
      </Modal>
    </div>
  );
}
