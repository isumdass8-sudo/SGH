import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/contact-info').then((res) => setForm(res.data.data || {})).finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.put('/contact-info', form);
      setSaved(true);
    } finally { setSaving(false); }
  }

  if (loading || !form) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-serif text-2xl font-bold text-charcoal-800">Hotel Settings</h1>
      <p className="text-sm text-charcoal-500">This information appears throughout the public website — home page, footer, contact and location pages.</p>

      {saved && <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">Settings saved successfully.</div>}

      <form onSubmit={handleSave} className="card space-y-4 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="label-field">Hotel Name</label><input className="input-field" value={form.hotel_name || ''} onChange={(e) => setForm({ ...form, hotel_name: e.target.value })} /></div>
          <div><label className="label-field">Tagline</label><input className="input-field" value={form.tagline || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
          <div><label className="label-field">Address</label><input className="input-field" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div><label className="label-field">City</label><input className="input-field" value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          <div><label className="label-field">Country</label><input className="input-field" value={form.country || ''} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
          <div><label className="label-field">Phone</label><input className="input-field" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="label-field">Email</label><input className="input-field" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="label-field">Website</label><input className="input-field" value={form.website || ''} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
          <div><label className="label-field">Facebook URL</label><input className="input-field" value={form.facebook_url || ''} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} /></div>
          <div><label className="label-field">Instagram URL</label><input className="input-field" value={form.instagram_url || ''} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} /></div>
          <div><label className="label-field">Latitude</label><input className="input-field" value={form.latitude || ''} onChange={(e) => setForm({ ...form, latitude: e.target.value })} /></div>
          <div><label className="label-field">Longitude</label><input className="input-field" value={form.longitude || ''} onChange={(e) => setForm({ ...form, longitude: e.target.value })} /></div>
          <div><label className="label-field">Check-in Time</label><input className="input-field" value={form.check_in_time || ''} onChange={(e) => setForm({ ...form, check_in_time: e.target.value })} /></div>
          <div><label className="label-field">Check-out Time</label><input className="input-field" value={form.check_out_time || ''} onChange={(e) => setForm({ ...form, check_out_time: e.target.value })} /></div>
          <div className="md:col-span-2"><label className="label-field">Distance from Airport</label><input className="input-field" value={form.distance_airport || ''} onChange={(e) => setForm({ ...form, distance_airport: e.target.value })} /></div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary"><Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}</button>
      </form>
    </div>
  );
}
