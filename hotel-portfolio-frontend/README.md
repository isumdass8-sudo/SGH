# Serenity Grand Hotel — Frontend (Standalone Demo)

A hotel portfolio website + admin panel, built with **React (Vite) + Tailwind CSS**.

This is a **frontend-only** build — there is no backend or database to set up. All data
(rooms, facilities, gallery, events, testimonials, inquiries, hotel settings) is stored in your
browser's `localStorage` and pre-loaded with sample content, so the whole app — including the
admin panel — works immediately after `npm install && npm run dev`.

> Looking for the full-stack version with a real Node.js/Express + MySQL backend? That's a
> separate build — this package only contains the React client.

---

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## What Works

- **Public site**: Home, About, Rooms & Suites, Facilities, Dining, Events, Gallery (with
  lightbox), Location (map embed), Contact — and the full dynamic Customer Inquiry form.
- **Admin panel** at `/admin/login`:
  - Demo login: `admin` / `Admin@123`
  - Dashboard with live stats & charts (based on inquiries you submit)
  - Inquiry management: search, filter, status updates, internal notes, activity history
  - Content management: add/edit/delete Rooms, Facilities, Gallery images, Events, Testimonials
  - Hotel Settings (contact info, address, map coordinates, check-in/out times)

Submitting the public inquiry form and then checking the admin Dashboard/Inquiries screen will
show your submission immediately — everything reads and writes to the same local mock store.

---

## How the Mock Backend Works

`src/services/api.js` implements a small mock REST layer with the same `get/post/put/delete`
interface a real API client would have. Instead of making network requests, it reads and writes
a JSON object in `localStorage` under the key `hotel_mock_db`, seeded on first load from
`src/services/mockData.js`.

This means:
- Data **persists across page reloads** (it's in your browser's localStorage).
- Data is **local to your browser** — nothing is sent anywhere, and nothing is shared between
  devices or visitors.
- The admin login is a plain-text demo check against `mockData.js` — **this is not secure** and
  is only meant for demoing the UI. Do not reuse this pattern for a real deployment.

### Resetting demo data

To wipe your changes and restore the original sample content, open your browser console on the
site and run:

```js
localStorage.removeItem('hotel_mock_db');
location.reload();
```

### Customizing the sample content

Edit `src/services/mockData.js` directly to change the starting rooms, facilities, gallery
images, events, testimonials, hotel contact info, or the demo admin account. Changes only take
effect for browsers that haven't already seeded their `localStorage` (or after a reset, see
above).

---

## Project Structure

```
src/
├── components/     Reusable UI: Navbar, Footer, InquiryForm, RoomCard, FacilityCard, Modal...
├── pages/          Public website pages
├── admin/          Admin panel (login, dashboard, content management screens)
├── layouts/        PublicLayout wraps every public page with Navbar/Footer
├── context/        AuthContext — admin session state (token stored in localStorage)
├── services/
│   ├── api.js        Mock REST layer (see above)
│   └── mockData.js   Seed content for the mock store
└── App.jsx         Routes for the public site and the admin panel
```

---

## Replacing Images

All photos are placeholder Unsplash stock images. Update the `main_image` / `image` /
`image_url` fields in `mockData.js`, or use the admin panel's Rooms/Facilities/Gallery/Events
screens to paste your own image URLs once the app is running.

---

## Production Build

```bash
npm run build      # outputs static files to dist/
npm run preview     # preview the production build locally
```

Since everything runs client-side, the build output in `dist/` can be deployed to any static
host (Netlify, Vercel, GitHub Pages, S3, etc.) with no server-side setup required.
