import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight, BedDouble } from 'lucide-react';
import api from '../services/api';
import FacilityCard from '../components/FacilityCard';
import heroBackground from '../assets/back.png';
import aboutImage from '../assets/r1.png';

const featuredRooms = [
  { name: 'Deluxe Room', description: 'Comfortable and elegant accommodation for a relaxing stay.' },
  { name: 'Family Room', description: 'Spacious accommodation designed for families and groups.' },
  { name: 'Standard Room', description: 'A comfortable and convenient choice for a peaceful stay.' },
];

const featuredFacilities = [
  {
    id: 1,
    name: 'Starlink Unlimited Internet',
    description: 'Enjoy fast and reliable Starlink internet connectivity throughout your stay.',
    icon: 'Wifi',
    availability_info: 'Available 24/7',
  },
  {
    id: 2,
    name: 'Air Conditioning',
    description: 'Comfortable, air-conditioned rooms for a cool and relaxing stay.',
    icon: 'Wind',
    availability_info: 'Available in all rooms',
  },
  {
    id: 3,
    name: 'Ironing Facilities',
    description: 'Convenient ironing facilities are available to keep your clothes neat and presentable.',
    icon: 'Shirt',
    availability_info: 'Available on request',
  },
  {
    id: 4,
    name: 'Laundry / Clothes Washing Service',
    description: 'Guests can make use of convenient clothes washing and laundry facilities during their stay.',
    icon: 'WashingMachine',
    availability_info: 'Available daily',
  },
  {
    id: 5,
    name: 'Peaceful Green Environment',
    description: 'Surrounded by greenery, the hotel provides a peaceful and harmonious environment where guests can relax and enjoy nature.',
    icon: 'Leaf',
    availability_info: 'Throughout the property',
  },
];

export default function Home() {
  const { contactInfo } = useOutletContext() || {};
  const [facilities, setFacilities] = useState(featuredFacilities);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    api.get('/gallery').then((g) => {
      setGallery(g.data.data.slice(0, 6));
    });
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative flex h-[92vh] min-h-[600px] items-center justify-center overflow-hidden">
        <img
          src={heroBackground}
          alt="Hotel exterior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/70 via-charcoal-900/50 to-charcoal-900/80" />
        <div className="container-max relative z-10 text-center text-white animate-slideUp">
          <p className="section-eyebrow text-gold-300">{contactInfo?.city ? `${contactInfo.city}, ${contactInfo.country}` : 'Kandy, Sri Lanka'}</p>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-6xl">
            {contactInfo?.hotel_name || 'Serenity Grand Hotel'}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
            {contactInfo?.tagline || 'Where Comfort Meets Elegance'}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/about" className="btn-outline">Explore Hotel</Link>
            <Link to="/inquiry" className="btn-primary">Make an Inquiry</Link>
          </div>
        </div>
      </section>

      {/* QUICK INFO STRIP */}
      <section className="border-b border-charcoal-100 bg-white py-6">
        <div className="container-max grid grid-cols-2 gap-6 text-sm text-charcoal-600 md:grid-cols-4">
          <div className="flex items-center gap-2"><MapPin size={18} className="text-gold-500" /> {contactInfo?.city || 'Kandy'}, {contactInfo?.country || 'Sri Lanka'}</div>
          <div className="flex items-center gap-2"><Phone size={18} className="text-gold-500" /> {contactInfo?.phone || '+94 31 222 3344'}</div>
          <div className="flex items-center gap-2"><Mail size={18} className="text-gold-500" /> {contactInfo?.email || 'reservations@hotel.com'}</div>
          <div className="flex items-center gap-2"><Clock size={18} className="text-gold-500" /> {contactInfo?.check_in_time || '2:00 PM'} in / {contactInfo?.check_out_time || '11:00 AM'} out</div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-20">
        <div className="container-max grid items-center gap-12 md:grid-cols-2">
          <img src={aboutImage} alt="Hotel lobby" className="rounded-2xl shadow-lg" loading="lazy" />
          <div>
            <p className="section-eyebrow">About Us</p>
            <h2 className="section-title mt-2">A tradition of warm hospitality</h2>
            <p className="mt-4 text-charcoal-500">
              Nestled along the coast, {contactInfo?.hotel_name || 'our hotel'} blends refined comfort with attentive service,
              offering guests a memorable escape whether traveling for leisure or business.
            </p>
            <Link to="/about" className="btn-secondary mt-6 inline-flex">
              Read More <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="bg-charcoal-50/40 py-20 text-charcoal-800">
        <div className="container-max grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-eyebrow">Accommodation</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-charcoal-800 md:text-4xl">Featured Rooms &amp; Suites</h2>
            <Link to="/rooms" className="btn-primary mt-8 inline-flex">
              View All Rooms <ArrowRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-charcoal-200 border-y border-charcoal-200">
            {featuredRooms.map((room, index) => (
              <article key={room.name} className="grid grid-cols-[2.5rem_1fr] items-start gap-4 py-5">
                <span className="pt-1 font-serif text-sm text-gold-600">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <div className="flex items-center gap-3">
                    <BedDouble size={18} strokeWidth={1.5} className="text-gold-600" />
                    <h3 className="font-serif text-xl font-semibold text-charcoal-800">{room.name}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-charcoal-500">{room.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FACILITIES PREVIEW */}
      <section className="py-20">
        <div className="container-max">
          <div className="mb-10 text-center">
            <p className="section-eyebrow">Amenities</p>
            <h2 className="section-title mt-2">Facilities Designed for Your Comfort</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {facilities.map((f, index) => (
              <div key={f.id} className={index === facilities.length - 1 ? 'sm:col-span-2 sm:w-full sm:max-w-[320px] sm:justify-self-center md:col-start-2 md:col-span-2' : ''}>
                <FacilityCard facility={f} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="bg-charcoal-50/40 py-20">
        <div className="container-max">
          <div className="mb-10 text-center">
            <p className="section-eyebrow">Gallery</p>
            <h2 className="section-title mt-2">A Glimpse of {contactInfo?.hotel_name || 'Our Hotel'}</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {gallery.map((g) => (
              <div key={g.id} className="overflow-hidden rounded-xl">
                <img src={g.image_url} alt={g.caption || 'Gallery image'} loading="lazy" className="h-48 w-full object-cover transition duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/gallery" className="btn-secondary">View Full Gallery</Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-charcoal-800 py-20 text-center text-white">
        <div className="container-max relative z-10">
          <h2 className="font-serif text-3xl font-semibold md:text-4xl">Have a question about your stay?</h2>
          <p className="mx-auto mt-3 max-w-lg text-charcoal-300">Our team is ready to help you plan the perfect visit, event, or celebration.</p>
          <Link to="/inquiry" className="btn-primary mt-8 inline-flex">Send an Inquiry</Link>
        </div>
      </section>
    </div>
  );
}
