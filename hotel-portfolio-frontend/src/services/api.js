// ============================================================================
// Frontend-only mock API.
//
// This file stands in for a real backend. It mimics the same request/response
// shapes the components expect (api.get/post/put/delete resolving to
// { data: {...} }), but everything is stored in the browser's localStorage —
// no server, no database required.
//
// To reset all demo data back to the original seed content, run in the
// browser console:  localStorage.removeItem('hotel_mock_db'); location.reload();
// ============================================================================

import { seedData } from './mockData';

const STORAGE_KEY = 'hotel_mock_db';
const NETWORK_DELAY = 300; // ms, purely cosmetic so loading states are visible
const legacyGalleryUrls = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200',
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
];

function loadDB() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const db = JSON.parse(raw);
      let changed = false;
      if (db.contactInfo?.city === 'Negombo') {
        db.contactInfo.city = 'Kandy';
        changed = true;
      }
      if (db.gallery?.length === legacyGalleryUrls.length && db.gallery.every((image, index) => image.image_url === legacyGalleryUrls[index])) {
        db.gallery = JSON.parse(JSON.stringify(seedData.gallery));
        changed = true;
      }
      const legacyRoomNames = new Set(['Deluxe Room', 'Superior Room', 'Family Room', 'Executive Suite']);
      const legacyRoomImages = new Set([
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200',
        'https://images.unsplash.com/photo-1611048268330-53de574cae3b?w=1200'
      ]);

      if (Array.isArray(db.rooms)) {
        const seededRoomIds = new Set(seedData.rooms.map((room) => String(room.id)));
        const normalizedRooms = db.rooms
          .filter((room) => seededRoomIds.has(String(room.id)))
          .map((room) => {
            const fallback = seedData.rooms.find((seedRoom) => String(seedRoom.id) === String(room.id));
            if (!fallback) return room;
            const needsNameUpdate = legacyRoomNames.has(room.name) || (room.name === 'Room 01' && fallback.name === 'Room 01' && room.main_image && legacyRoomImages.has(room.main_image));
            const needsImageUpdate = legacyRoomImages.has(room.main_image) || (!room.main_image && fallback.main_image);
            if (needsNameUpdate || needsImageUpdate) {
              return { ...room, name: fallback.name, main_image: fallback.main_image };
            }
            return room;
          });

        const currentSeedRoomCount = seedData.rooms.length;
        const shouldReplaceRooms = db.rooms.length !== currentSeedRoomCount || normalizedRooms.length !== currentSeedRoomCount || normalizedRooms.some((room, index) => room.name !== seedData.rooms[index].name || room.main_image !== seedData.rooms[index].main_image);

        if (shouldReplaceRooms) {
          db.rooms = JSON.parse(JSON.stringify(seedData.rooms));
          changed = true;
        }
      }

      if (changed) saveDB(db);
      return db;
    } catch { /* fall through to reseed */ }
  }
  const fresh = JSON.parse(JSON.stringify(seedData));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function delay(result) {
  return new Promise((resolve, reject) => {
    setTimeout(() => (result.ok ? resolve(result.value) : reject(result.value)), NETWORK_DELAY);
  });
}

function ok(data) { return { ok: true, value: { data } }; }
function fail(status, message, errors) {
  return { ok: false, value: { response: { status, data: { success: false, message, ...(errors ? { errors } : {}) } } } };
}

function generateReference(seq) {
  const year = new Date().getFullYear();
  return `INQ-${year}-${String(seq).padStart(6, '0')}`;
}

function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || ''); }
function isValidPhone(phone) { return /^[+0-9()\-\s]{7,20}$/.test(phone || ''); }

function segments(url) {
  return url.split('?')[0].split('/').filter(Boolean);
}

// ----------------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------------
function handleGet(url, params = {}) {
  const db = loadDB();
  const seg = segments(url);

  if (seg[0] === 'rooms' && seg.length === 1) {
    const rooms = params.all ? db.rooms : db.rooms.filter((r) => r.is_active);
    return ok({ success: true, data: [...rooms].sort((a, b) => a.display_order - b.display_order) });
  }
  if (seg[0] === 'rooms' && seg.length === 2) {
    const room = db.rooms.find((r) => String(r.id) === seg[1]);
    if (!room) return fail(404, 'Room not found.');
    return ok({ success: true, data: room });
  }

  if (seg[0] === 'facilities' && seg.length === 1) {
    let list = params.all ? db.facilities : db.facilities.filter((f) => f.is_active);
    if (params.category) list = list.filter((f) => f.category === params.category);
    return ok({ success: true, data: [...list].sort((a, b) => a.display_order - b.display_order) });
  }
  if (seg[0] === 'facilities' && seg.length === 2) {
    const f = db.facilities.find((x) => String(x.id) === seg[1]);
    if (!f) return fail(404, 'Facility not found.');
    return ok({ success: true, data: f });
  }

  if (seg[0] === 'gallery' && seg.length === 1) {
    let list = db.gallery;
    if (params.category) list = list.filter((g) => g.category === params.category);
    return ok({ success: true, data: [...list].sort((a, b) => a.display_order - b.display_order) });
  }

  if (seg[0] === 'events' && seg.length === 1) {
    const list = params.all ? db.events : db.events.filter((e) => e.is_active);
    return ok({ success: true, data: [...list].sort((a, b) => a.display_order - b.display_order) });
  }

  if (seg[0] === 'testimonials' && seg.length === 1) {
    const list = params.all ? db.testimonials : db.testimonials.filter((t) => t.is_active);
    return ok({ success: true, data: [...list].sort((a, b) => a.display_order - b.display_order) });
  }

  if (seg[0] === 'contact-info') {
    return ok({ success: true, data: db.contactInfo });
  }

  if (seg[0] === 'inquiries' && seg[1] === 'stats' && seg[2] === 'summary') {
    const all = db.inquiries;
    const today = new Date().toDateString();
    const totals = {
      total: all.length,
      new_count: all.filter((i) => i.status === 'new').length,
      contacted_count: all.filter((i) => i.status === 'contacted').length,
      in_progress_count: all.filter((i) => i.status === 'in_progress').length,
      resolved_count: all.filter((i) => i.status === 'resolved').length,
      closed_count: all.filter((i) => i.status === 'closed').length,
      today_count: all.filter((i) => new Date(i.created_at).toDateString() === today).length
    };
    const byTypeMap = {};
    all.forEach((i) => { byTypeMap[i.inquiry_type] = (byTypeMap[i.inquiry_type] || 0) + 1; });
    const byType = Object.entries(byTypeMap).map(([inquiry_type, count]) => ({ inquiry_type, count }));

    const last7days = [];
    for (let d = 6; d >= 0; d--) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      const dateStr = date.toISOString().slice(0, 10);
      const count = all.filter((i) => i.created_at.slice(0, 10) === dateStr).length;
      last7days.push({ date: dateStr, count });
    }

    const recent = [...all]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8)
      .map((i) => ({ id: i.id, inquiry_reference: i.inquiry_reference, full_name: i.full_name, inquiry_type: i.inquiry_type, status: i.status, created_at: i.created_at }));

    return ok({ success: true, totals, byType, last7days, recent });
  }

  if (seg[0] === 'inquiries' && seg.length === 1) {
    let list = [...db.inquiries];
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter((i) =>
        i.full_name.toLowerCase().includes(s) || i.email.toLowerCase().includes(s) ||
        i.phone.toLowerCase().includes(s) || i.inquiry_reference.toLowerCase().includes(s)
      );
    }
    if (params.status) list = list.filter((i) => i.status === params.status);
    if (params.inquiry_type) list = list.filter((i) => i.inquiry_type === params.inquiry_type);
    if (params.event_type) list = list.filter((i) => i.event_type === params.event_type);
    if (params.date_from) list = list.filter((i) => i.created_at.slice(0, 10) >= params.date_from);
    if (params.date_to) list = list.filter((i) => i.created_at.slice(0, 10) <= params.date_to);

    const sortBy = params.sort_by || 'created_at';
    const sortDir = (params.sort_dir || 'DESC').toUpperCase();
    list.sort((a, b) => {
      const av = a[sortBy], bv = b[sortBy];
      if (av < bv) return sortDir === 'ASC' ? -1 : 1;
      if (av > bv) return sortDir === 'ASC' ? 1 : -1;
      return 0;
    });

    const total = list.length;
    const page = Math.max(1, parseInt(params.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(params.limit, 10) || 15));
    const start = (page - 1) * limit;
    const pageItems = list.slice(start, start + limit);

    return ok({ success: true, data: pageItems, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } });
  }

  if (seg[0] === 'inquiries' && seg.length === 2) {
    const inquiry = db.inquiries.find((i) => String(i.id) === seg[1]);
    if (!inquiry) return fail(404, 'Inquiry not found.');
    const history = (db.inquiryHistory[inquiry.id] || []).slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return ok({ success: true, data: inquiry, history });
  }

  return fail(404, `Mock route not found: GET ${url}`);
}

// ----------------------------------------------------------------------------
// POST
// ----------------------------------------------------------------------------
function handlePost(url, body = {}) {
  const db = loadDB();
  const seg = segments(url);

  if (seg[0] === 'auth' && seg[1] === 'login') {
    const { username, password } = body;
    const admin = db.admins.find((a) => (a.username === username || a.email === username) && a.password === password);
    if (!admin) return fail(401, 'Invalid credentials.');
    const token = btoa(JSON.stringify({ id: admin.id, username: admin.username, role: admin.role, iat: Date.now() }));
    return ok({
      success: true,
      token,
      admin: { id: admin.id, fullName: admin.full_name, username: admin.username, email: admin.email, role: admin.role }
    });
  }

  if (seg[0] === 'auth' && seg[1] === 'logout') {
    return ok({ success: true, message: 'Logged out successfully.' });
  }

  if (seg[0] === 'inquiries' && seg.length === 1) {
    const errors = [];
    if (!body.full_name?.trim()) errors.push('Full name is required.');
    if (!isValidEmail(body.email)) errors.push('A valid email address is required.');
    if (!isValidPhone(body.phone)) errors.push('A valid phone number is required.');
    if (!body.inquiry_type) errors.push('A valid inquiry type is required.');
    if (!body.consent) errors.push('You must agree to be contacted regarding this inquiry.');
    if (body.check_in_date && body.check_out_date && body.check_out_date < body.check_in_date) {
      errors.push('Check-out date cannot be before check-in date.');
    }
    if (errors.length) return fail(400, 'Validation failed.', errors);

    db.counters.inquiry += 1;
    const id = db.counters.inquiry;
    const reference = generateReference(id);
    const now = new Date().toISOString();
    const record = {
      id, inquiry_reference: reference,
      full_name: body.full_name.trim(), email: body.email.trim(), phone: body.phone.trim(),
      country: body.country || null, preferred_contact_method: body.preferred_contact_method || 'email',
      inquiry_type: body.inquiry_type,
      check_in_date: body.check_in_date || null, check_out_date: body.check_out_date || null,
      adults: body.adults || null, children: body.children || null, room_type: body.room_type || null, number_of_rooms: body.number_of_rooms || null,
      event_type: body.event_type || null, event_date: body.event_date || null, number_of_guests: body.number_of_guests || null, venue_preference: body.venue_preference || null,
      message: body.message || null, consent: body.consent ? 1 : 0,
      status: 'new', admin_notes: null,
      created_at: now, updated_at: now
    };
    db.inquiries.push(record);
    db.inquiryHistory[id] = [{ id: 1, admin_id: null, admin_name: null, action: 'Inquiry submitted', note: `Submitted by ${record.full_name} via website.`, created_at: now }];
    saveDB(db);
    return ok({ success: true, message: 'Thank you for your inquiry. Our hotel team will contact you soon.', inquiry_reference: reference });
  }

  if (seg[0] === 'inquiries' && seg[2] === 'notes') {
    const inquiry = db.inquiries.find((i) => String(i.id) === seg[1]);
    if (!inquiry) return fail(404, 'Inquiry not found.');
    if (!body.note?.trim()) return fail(400, 'Note text is required.');
    inquiry.admin_notes = body.note;
    inquiry.updated_at = new Date().toISOString();
    db.inquiryHistory[inquiry.id] = db.inquiryHistory[inquiry.id] || [];
    db.inquiryHistory[inquiry.id].push({ id: Date.now(), admin_id: 1, admin_name: 'Hotel Administrator', action: 'Note added', note: body.note, created_at: new Date().toISOString() });
    saveDB(db);
    return ok({ success: true, message: 'Note added successfully.' });
  }

  if (seg[0] === 'rooms' && seg.length === 1) {
    db.counters.room += 1;
    const room = { id: db.counters.room, is_active: 1, display_order: db.rooms.length + 1, gallery: [], facilities: [], ...body };
    db.rooms.push(room);
    saveDB(db);
    return ok({ success: true, message: 'Room created successfully.', id: room.id });
  }

  if (seg[0] === 'facilities' && seg.length === 1) {
    db.counters.facility += 1;
    const facility = { id: db.counters.facility, is_active: 1, display_order: db.facilities.length + 1, ...body };
    db.facilities.push(facility);
    saveDB(db);
    return ok({ success: true, message: 'Facility created successfully.', id: facility.id });
  }

  if (seg[0] === 'gallery' && seg.length === 1) {
    if (!body.image_url) return fail(400, 'Image URL is required.');
    db.counters.gallery += 1;
    const img = { id: db.counters.gallery, category: 'hotel', caption: null, display_order: db.gallery.length + 1, ...body };
    db.gallery.push(img);
    saveDB(db);
    return ok({ success: true, message: 'Image added successfully.', id: img.id });
  }

  if (seg[0] === 'events' && seg.length === 1) {
    db.counters.event += 1;
    const event = { id: db.counters.event, is_active: 1, display_order: db.events.length + 1, facilities: [], ...body };
    db.events.push(event);
    saveDB(db);
    return ok({ success: true, message: 'Event created successfully.', id: event.id });
  }

  if (seg[0] === 'testimonials' && seg.length === 1) {
    db.counters.testimonial += 1;
    const t = { id: db.counters.testimonial, is_active: 1, display_order: db.testimonials.length + 1, rating: 5, ...body };
    db.testimonials.push(t);
    saveDB(db);
    return ok({ success: true, message: 'Testimonial created successfully.', id: t.id });
  }

  return fail(404, `Mock route not found: POST ${url}`);
}

// ----------------------------------------------------------------------------
// PUT
// ----------------------------------------------------------------------------
function handlePut(url, body = {}) {
  const db = loadDB();
  const seg = segments(url);

  if (seg[0] === 'inquiries' && seg[2] === 'status') {
    const inquiry = db.inquiries.find((i) => String(i.id) === seg[1]);
    if (!inquiry) return fail(404, 'Inquiry not found.');
    inquiry.status = body.status;
    inquiry.updated_at = new Date().toISOString();
    db.inquiryHistory[inquiry.id] = db.inquiryHistory[inquiry.id] || [];
    db.inquiryHistory[inquiry.id].push({ id: Date.now(), admin_id: 1, admin_name: 'Hotel Administrator', action: `Status changed to "${body.status.replace('_', ' ')}"`, note: null, created_at: new Date().toISOString() });
    saveDB(db);
    return ok({ success: true, message: 'Status updated successfully.' });
  }

  if (seg[0] === 'inquiries' && seg.length === 2) {
    const inquiry = db.inquiries.find((i) => String(i.id) === seg[1]);
    if (!inquiry) return fail(404, 'Inquiry not found.');
    Object.assign(inquiry, body, { updated_at: new Date().toISOString() });
    saveDB(db);
    return ok({ success: true, message: 'Inquiry updated successfully.' });
  }

  if (seg[0] === 'rooms' && seg.length === 2) {
    const room = db.rooms.find((r) => String(r.id) === seg[1]);
    if (!room) return fail(404, 'Room not found.');
    Object.assign(room, body);
    saveDB(db);
    return ok({ success: true, message: 'Room updated successfully.' });
  }

  if (seg[0] === 'facilities' && seg.length === 2) {
    const f = db.facilities.find((x) => String(x.id) === seg[1]);
    if (!f) return fail(404, 'Facility not found.');
    Object.assign(f, body);
    saveDB(db);
    return ok({ success: true, message: 'Facility updated successfully.' });
  }

  if (seg[0] === 'events' && seg.length === 2) {
    const e = db.events.find((x) => String(x.id) === seg[1]);
    if (!e) return fail(404, 'Event not found.');
    Object.assign(e, body);
    saveDB(db);
    return ok({ success: true, message: 'Event updated successfully.' });
  }

  if (seg[0] === 'testimonials' && seg.length === 2) {
    const t = db.testimonials.find((x) => String(x.id) === seg[1]);
    if (!t) return fail(404, 'Testimonial not found.');
    Object.assign(t, body);
    saveDB(db);
    return ok({ success: true, message: 'Testimonial updated successfully.' });
  }

  if (seg[0] === 'contact-info') {
    db.contactInfo = { ...db.contactInfo, ...body };
    saveDB(db);
    return ok({ success: true, message: 'Contact information updated successfully.' });
  }

  return fail(404, `Mock route not found: PUT ${url}`);
}

// ----------------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------------
function handleDelete(url) {
  const db = loadDB();
  const seg = segments(url);

  const collections = { rooms: 'rooms', facilities: 'facilities', gallery: 'gallery', events: 'events', testimonials: 'testimonials', inquiries: 'inquiries' };
  const key = collections[seg[0]];
  if (key && seg.length === 2) {
    const before = db[key].length;
    db[key] = db[key].filter((item) => String(item.id) !== seg[1]);
    if (db[key].length === before) return fail(404, 'Item not found.');
    saveDB(db);
    return ok({ success: true, message: 'Deleted successfully.' });
  }

  return fail(404, `Mock route not found: DELETE ${url}`);
}

// ----------------------------------------------------------------------------
// Public API — matches the axios-style interface the rest of the app expects
// ----------------------------------------------------------------------------
const api = {
  get: (url, config = {}) => delay(handleGet(url, config.params || {})),
  post: (url, body) => delay(handlePost(url, body)),
  put: (url, body) => delay(handlePut(url, body)),
  delete: (url) => delay(handleDelete(url))
};

export default api;
