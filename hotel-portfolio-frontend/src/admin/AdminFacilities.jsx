import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const EMPTY = { name: '', category: 'guest', description: '', icon: '', image: '', availability_info: '', is_active: 1, display_order: 0 };
const CATEGORIES = ['guest', 'recreation', 'business', 'dining', 'other'];

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get('/facilities', { params: { all: true } }).then((res) => setFacilities(res.data.data)).finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(f) { setEditing(f); setForm(f); setModalOpen(true); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.put(`/facilities/${editing.id}`, form);
      else await api.post('/facilities', form);
      setModalOpen(false);
      load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this facility?')) return;
    await api.delete(`/facilities/${id}`);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-charcoal-800">Manage Facilities</h1>
        <button onClick={openCreate} className="btn-primary"><Plus size={18} /> Add Facility</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-charcoal-50 text-charcoal-500">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Availability</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody>
              {facilities.map((f) => (
                <tr key={f.id} className="border-t border-charcoal-100">
                  <td className="px-4 py-3 font-medium text-charcoal-800">{f.name}</td>
                  <td className="px-4 py-3 capitalize">{f.category}</td>
                  <td className="px-4 py-3 text-charcoal-500">{f.availability_info || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${f.is_active ? 'bg-green-100 text-green-700' : 'bg-charcoal-100 text-charcoal-500'}`}>
                      {f.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(f)} className="mr-2 text-gold-600 hover:underline"><Pencil size={14} className="inline" /></button>
                    <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:underline"><Trash2 size={14} className="inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Facility' : 'Add Facility'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label-field">Name *</label><input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div>
              <label className="label-field">Category</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="label-field">Icon (lucide name, e.g. Wifi)</label><input className="input-field" value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
            <div><label className="label-field">Image URL</label><input className="input-field" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
            <div><label className="label-field">Availability Info</label><input className="input-field" value={form.availability_info || ''} onChange={(e) => setForm({ ...form, availability_info: e.target.value })} /></div>
            <div>
              <label className="label-field">Status</label>
              <select className="input-field" value={form.is_active} onChange={(e) => setForm({ ...form, is_active: Number(e.target.value) })}>
                <option value={1}>Active</option>
                <option value={0}>Hidden</option>
              </select>
            </div>
          </div>
          <div><label className="label-field">Description</label><textarea rows={3} className="input-field" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Save Facility'}</button>
        </form>
      </Modal>
    </div>
  );
}
