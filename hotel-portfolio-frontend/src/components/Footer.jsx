import { Link } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Mail, Phone } from 'lucide-react';
import hotelLogo from '../assets/logo 123.jpeg';

export default function Footer({ contactInfo }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-800 text-charcoal-200">
      <div className="container-max grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <img src={hotelLogo} alt="Hotel logo" className="h-10 w-auto object-contain" />
            <span className="font-serif text-lg font-bold text-white">{contactInfo?.hotel_name ? contactInfo.hotel_name.replace(/\s+Hotel\b/gi, '').trim() : 'Mount Aureliya Homestay'}</span>
          </div>
          <p className="text-sm text-charcoal-300">{contactInfo?.tagline || 'Where Comfort Meets Elegance'}</p>
          <div className="mt-4 flex gap-3">
            {contactInfo?.facebook_url && (
              <a href={contactInfo.facebook_url} target="_blank" rel="noreferrer" className="rounded-full bg-charcoal-700 p-2 hover:bg-gold-500">
                <Facebook size={16} />
              </a>
            )}
            {contactInfo?.instagram_url && (
              <a href={contactInfo.instagram_url} target="_blank" rel="noreferrer" className="rounded-full bg-charcoal-700 p-2 hover:bg-gold-500">
                <Instagram size={16} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm text-charcoal-300">
            <li><Link to="/about" className="hover:text-gold-400">About Us</Link></li>
            <li><Link to="/rooms" className="hover:text-gold-400">Rooms &amp; Suites</Link></li>
            <li><Link to="/facilities" className="hover:text-gold-400">Facilities</Link></li>
            <li><Link to="/gallery" className="hover:text-gold-400">Gallery</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Guest Info</h4>
          <ul className="space-y-2 text-sm text-charcoal-300">
            <li>Check-in: {contactInfo?.check_in_time || '2:00 PM'}</li>
            <li>Check-out: {contactInfo?.check_out_time || '11:00 AM'}</li>
            <li><Link to="/inquiry" className="hover:text-gold-400">Make an Inquiry</Link></li>
            <li><Link to="/location" className="hover:text-gold-400">Location &amp; Directions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Contact</h4>
          <ul className="space-y-3 text-sm text-charcoal-300">
            {contactInfo?.address && (
              <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" /> {contactInfo.address}, {contactInfo.city}</li>
            )}
            {contactInfo?.phone && (
              <li className="flex items-center gap-2"><Phone size={16} className="text-gold-400" /> {contactInfo.phone}</li>
            )}
            {contactInfo?.email && (
              <li className="flex items-center gap-2"><Mail size={16} className="text-gold-400" /> {contactInfo.email}</li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-charcoal-700 py-5 text-center text-xs text-charcoal-400">
        © {year} {contactInfo?.hotel_name || 'Mount Aureliya Homestay'}. All rights reserved. &middot; <Link to="/admin/login" className="hover:text-gold-400">Admin</Link>
      </div>
    </footer>
  );
}
