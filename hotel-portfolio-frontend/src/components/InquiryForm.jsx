import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import api from '../services/api';

const WEB3FORMS_ACCESS_KEY = 'c07e7014-9354-4ec8-b71a-dffae2f34f9e';

const INQUIRY_TYPES = [
  { value: 'room', label: 'Room Inquiry' },
  { value: 'wedding_event', label: 'Wedding / Event Inquiry' },
  { value: 'restaurant', label: 'Restaurant Inquiry' },
  { value: 'corporate', label: 'Corporate Inquiry' },
  { value: 'conference', label: 'Conference / Meeting' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'other', label: 'Other' },
];

const EMPTY = {
  full_name: '', email: '', phone: '', country: '', preferred_contact_method: 'email',
  inquiry_type: 'room',
  check_in_date: '', check_out_date: '', adults: 1, children: 0, room_type: '', number_of_rooms: 1,
  event_type: '', event_date: '', number_of_guests: '', venue_preference: '',
  message: '', consent: false
};

export default function InquiryForm({ defaultType = 'room', defaultRoomType = '', defaultEventType = '' }) {
  const [form, setForm] = useState({ ...EMPTY, inquiry_type: defaultType, room_type: defaultRoomType, event_type: defaultEventType });
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reference, setReference] = useState('');

  const showStay = form.inquiry_type === 'room';
  const showEvent = ['wedding_event', 'corporate', 'conference'].includes(form.inquiry_type);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validateClientSide() {
    const errs = [];
    if (!form.full_name.trim()) errs.push('Full name is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.push('A valid email address is required.');
    if (!/^[+0-9()\-\s]{7,20}$/.test(form.phone)) errs.push('A valid phone number is required.');
    if (showStay && form.check_in_date && form.check_out_date && form.check_out_date < form.check_in_date) {
      errs.push('Check-out cannot be before check-in.');
    }
    if (!form.consent) errs.push('Please agree to be contacted regarding this inquiry.');
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    const clientErrors = validateClientSide();
    if (clientErrors.length) { setErrors(clientErrors); return; }

    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!showStay) { payload.check_in_date = null; payload.check_out_date = null; }
      if (!showEvent) { payload.event_date = null; }

      const inquiryType = INQUIRY_TYPES.find((type) => type.value === form.inquiry_type)?.label || form.inquiry_type;
      const web3Response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `${inquiryType} from ${form.full_name}`,
          name: form.full_name,
          from_name: form.full_name,
          email: form.email,
          phone: form.phone,
          country: form.country || 'Not provided',
          preferred_contact_method: form.preferred_contact_method,
          inquiry_type: inquiryType,
          check_in_date: payload.check_in_date || 'Not provided',
          check_out_date: payload.check_out_date || 'Not provided',
          adults: showStay ? form.adults : 'Not provided',
          children: showStay ? form.children : 'Not provided',
          room_type: showStay ? form.room_type || 'Not provided' : 'Not provided',
          number_of_rooms: showStay ? form.number_of_rooms : 'Not provided',
          event_type: showEvent ? form.event_type || 'Not provided' : 'Not provided',
          event_date: payload.event_date || 'Not provided',
          number_of_guests: showEvent ? form.number_of_guests || 'Not provided' : 'Not provided',
          venue_preference: showEvent ? form.venue_preference || 'Not provided' : 'Not provided',
          message: form.message || 'No additional message provided.',
        }),
      });
      const result = await web3Response.json();
      if (!web3Response.ok || !result.success) {
        throw new Error(result.message || 'Unable to send your inquiry. Please try again.');
      }

      let inquiryReference = '';
      try {
        const { data } = await api.post('/inquiries', payload);
        inquiryReference = data.inquiry_reference || '';
      } catch (storageError) {
        console.error('Inquiry was emailed, but could not be saved to the local inquiry list.', storageError);
      }
      setReference(inquiryReference);
      setSuccess(true);
      setForm({ ...EMPTY, inquiry_type: form.inquiry_type });
    } catch (err) {
      const apiErrors = err.response?.data?.errors || [err.response?.data?.message || err.message || 'Something went wrong. Please try again.'];
      setErrors(apiErrors);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-charcoal-100">
        <CheckCircle2 className="mx-auto mb-4 text-green-500" size={56} />
        <h3 className="font-serif text-2xl font-semibold text-charcoal-800">Thank you for your inquiry.</h3>
        <p className="mt-2 text-charcoal-500">Our hotel team will contact you soon.</p>
        {reference && (
          <>
            <p className="mt-4 inline-block rounded-full bg-gold-50 px-4 py-2 font-mono text-sm font-semibold text-gold-700">
              {reference}
            </p>
            <p className="mt-1 text-xs text-charcoal-400">Please keep this reference number for your records.</p>
          </>
        )}
        <button className="btn-secondary mt-6" onClick={() => { setSuccess(false); setReference(''); }}>Submit another inquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-charcoal-100 md:p-10">
      {errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <ul className="list-inside list-disc space-y-1">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {/* Customer Details */}
      <fieldset>
        <legend className="mb-4 font-serif text-lg font-semibold text-charcoal-800">Customer Details</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label-field">Full Name *</label>
            <input className="input-field" value={form.full_name} onChange={(e) => update('full_name', e.target.value)} required />
          </div>
          <div>
            <label className="label-field">Email Address *</label>
            <input type="email" className="input-field" value={form.email} onChange={(e) => update('email', e.target.value)} required />
          </div>
          <div>
            <label className="label-field">Phone Number *</label>
            <input className="input-field" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
          </div>
          <div>
            <label className="label-field">Country</label>
            <input className="input-field" value={form.country} onChange={(e) => update('country', e.target.value)} />
          </div>
          <div>
            <label className="label-field">Preferred Contact Method</label>
            <select className="input-field" value={form.preferred_contact_method} onChange={(e) => update('preferred_contact_method', e.target.value)}>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* Inquiry Details */}
      <fieldset>
        <legend className="mb-4 font-serif text-lg font-semibold text-charcoal-800">Inquiry Details</legend>
        <label className="label-field">Inquiry Type *</label>
        <select className="input-field" value={form.inquiry_type} onChange={(e) => update('inquiry_type', e.target.value)}>
          {INQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </fieldset>

      {/* Stay Details — dynamic */}
      {showStay && (
        <fieldset className="rounded-xl bg-gold-50/50 p-5 animate-fadeIn">
          <legend className="mb-4 font-serif text-lg font-semibold text-charcoal-800">Stay Details</legend>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label-field">Check-in Date</label>
              <input type="date" className="input-field" value={form.check_in_date} onChange={(e) => update('check_in_date', e.target.value)} />
            </div>
            <div>
              <label className="label-field">Check-out Date</label>
              <input type="date" className="input-field" value={form.check_out_date} onChange={(e) => update('check_out_date', e.target.value)} min={form.check_in_date || undefined} />
            </div>
            <div>
              <label className="label-field">Number of Adults</label>
              <input type="number" min="1" className="input-field" value={form.adults} onChange={(e) => update('adults', e.target.value)} />
            </div>
            <div>
              <label className="label-field">Number of Children</label>
              <input type="number" min="0" className="input-field" value={form.children} onChange={(e) => update('children', e.target.value)} />
            </div>
            <div>
              <label className="label-field">Room Type</label>
              <input className="input-field" placeholder="e.g. Deluxe Room" value={form.room_type} onChange={(e) => update('room_type', e.target.value)} />
            </div>
            <div>
              <label className="label-field">Number of Rooms</label>
              <input type="number" min="1" className="input-field" value={form.number_of_rooms} onChange={(e) => update('number_of_rooms', e.target.value)} />
            </div>
          </div>
        </fieldset>
      )}

      {/* Event Details — dynamic */}
      {showEvent && (
        <fieldset className="rounded-xl bg-gold-50/50 p-5 animate-fadeIn">
          <legend className="mb-4 font-serif text-lg font-semibold text-charcoal-800">Event Details</legend>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label-field">Event Type</label>
              <input className="input-field" placeholder="e.g. Wedding, Product Launch" value={form.event_type} onChange={(e) => update('event_type', e.target.value)} />
            </div>
            <div>
              <label className="label-field">Event Date</label>
              <input type="date" className="input-field" value={form.event_date} onChange={(e) => update('event_date', e.target.value)} />
            </div>
            <div>
              <label className="label-field">Number of Guests</label>
              <input type="number" min="1" className="input-field" value={form.number_of_guests} onChange={(e) => update('number_of_guests', e.target.value)} />
            </div>
            <div>
              <label className="label-field">Venue Preference</label>
              <input className="input-field" placeholder="e.g. Garden, Ballroom" value={form.venue_preference} onChange={(e) => update('venue_preference', e.target.value)} />
            </div>
          </div>
        </fieldset>
      )}

      <div>
        <label className="label-field">Message</label>
        <textarea rows={5} className="input-field" placeholder="Please tell us about your requirements..." value={form.message} onChange={(e) => update('message', e.target.value)} />
      </div>

      <label className="flex items-start gap-3 text-sm text-charcoal-600">
        <input type="checkbox" className="mt-1 h-4 w-4 rounded border-charcoal-300 text-gold-500 focus:ring-gold-400" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} />
        I agree that the hotel may contact me regarding this inquiry.
      </label>

      <button type="submit" disabled={submitting} className="btn-primary w-full md:w-auto">
        {submitting && <Loader2 className="animate-spin" size={18} />}
        {submitting ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  );
}
