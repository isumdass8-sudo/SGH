import { Routes, Route } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';
import About from './pages/About';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import Facilities from './pages/Facilities';
import Gallery from './pages/Gallery';
import LocationPage from './pages/Location';
import Contact from './pages/Contact';
import Inquiry from './pages/Inquiry';

import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminInquiries from './admin/AdminInquiries';
import AdminInquiryDetail from './admin/AdminInquiryDetail';
import AdminRooms from './admin/AdminRooms';
import AdminFacilities from './admin/AdminFacilities';
import AdminGallery from './admin/AdminGallery';
import AdminEvents from './admin/AdminEvents';
import AdminTestimonials from './admin/AdminTestimonials';
import AdminSettings from './admin/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Public website */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/inquiry" element={<Inquiry />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inquiries" element={<AdminInquiries />} />
        <Route path="inquiries/:id" element={<AdminInquiryDetail />} />
        <Route path="rooms" element={<AdminRooms />} />
        <Route path="facilities" element={<AdminFacilities />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="font-serif text-5xl font-bold text-charcoal-800">404</h1>
      <p className="mt-2 text-charcoal-500">Page not found.</p>
      <a href="/" className="btn-primary mt-6">Return Home</a>
    </div>
  );
}
