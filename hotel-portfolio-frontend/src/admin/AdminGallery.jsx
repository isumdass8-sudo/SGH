import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['hotel', 'rooms', 'restaurant', 'facilities', 'events', 'exterior', 'interior'];

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ image_url: '', category: 'hotel', caption: '' });
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get('/gallery').then((res) => setImages(res.data.data)).finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/gallery', form);
      setModalOpen(false);
      setForm({ image_url: '', category: 'hotel', caption: '' });
      load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this image?')) return;
    await api.delete(`/gallery/${id}`);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-charcoal-800">Manage Gallery</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={18} /> Add Image</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-xl">
              <img src={img.image_url} alt={img.caption || ''} className="h-36 w-full object-cover" />
              <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                <span className="rounded bg-white/90 px-2 py-0.5 text-xs capitalize">{img.category}</span>
                <button onClick={() => handleDelete(img.id)} className="rounded-full bg-red-500 p-1.5 text-white"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Gallery Image">
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="label-field">Image URL *</label><input required className="input-field" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
          <div>
            <label className="label-field">Category</label>
            <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="label-field">Caption (optional)</label><input className="input-field" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} /></div>
          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Add Image'}</button>
        </form>
      </Modal>
    </div>
  );
}
