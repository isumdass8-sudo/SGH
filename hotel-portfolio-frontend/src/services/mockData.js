// Local mock "database" — mirrors database/seed.sql from the full-stack version.
// Used only when running the frontend standalone, with no backend/API.

import galleryPhoto1 from '../assets/1.jpeg';
import galleryPhoto2 from '../assets/2.jpeg';
import galleryPhoto3 from '../assets/3.jpeg';
import roomOneImage from '../assets/om 1.jpeg';
import roomTwoImage from '../assets/om 2.jpeg';

export const seedData = {
  contactInfo: {
    id: 1,
    hotel_name: 'Serenity Grand Hotel',
    tagline: 'Where Comfort Meets Elegance',
    address: '124 Ocean Drive',
    city: 'Kandy',
    country: 'Sri Lanka',
    phone: '+94 31 222 3344',
    email: 'reservations@serenitygrand.com',
    website: 'www.serenitygrand.com',
    facebook_url: 'https://facebook.com',
    instagram_url: 'https://instagram.com',
    latitude: 7.2094,
    longitude: 79.8380,
    check_in_time: '2:00 PM',
    check_out_time: '11:00 AM',
    distance_airport: '15 minutes from Bandaranaike Int. Airport'
  },

  rooms: [
    {
      id: 1, name: 'Room 01', description: 'A spacious and elegantly furnished room designed for comfort, featuring modern decor and calming garden views.',
      max_guests: 2, bed_type: 'Queen Bed', room_size: '32 sqm', room_view: 'Garden View', price_display: '',
      main_image: roomOneImage,
      facilities: ['Free Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Flat-screen TV'], gallery: [], is_active: 1, display_order: 1
    },
    {
      id: 2, name: 'Room 02', description: 'Bright and airy with contemporary furnishings, ideal for travelers seeking extra space and comfort.',
      max_guests: 2, bed_type: 'King Bed', room_size: '36 sqm', room_view: 'Pool View', price_display: '',
      main_image: roomTwoImage,
      facilities: ['Free Wi-Fi', 'Air Conditioning', 'Balcony', 'Mini Bar'], gallery: [], is_active: 1, display_order: 2
    },
  ],

  facilities: [
    { id: 1, name: 'Swimming Pool', category: 'recreation', description: 'A large outdoor infinity pool surrounded by loungers and tropical landscaping.', icon: 'Waves', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1000', availability_info: 'Open 6:00 AM – 8:00 PM', is_active: 1, display_order: 1 },
    { id: 2, name: 'Restaurant', category: 'dining', description: 'Fine dining restaurant serving local and international cuisine.', icon: 'UtensilsCrossed', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1000', availability_info: 'Open 7:00 AM – 11:00 PM', is_active: 1, display_order: 2 },
    { id: 3, name: 'Free Wi-Fi', category: 'guest', description: 'High-speed internet access throughout the property.', icon: 'Wifi', image: null, availability_info: 'Available 24/7', is_active: 1, display_order: 3 },
    { id: 4, name: 'Parking', category: 'guest', description: 'Complimentary secure parking for all guests.', icon: 'Car', image: null, availability_info: 'Available 24/7', is_active: 1, display_order: 4 },
    { id: 5, name: 'Conference Room', category: 'business', description: 'Fully equipped conference room suitable for meetings and small events.', icon: 'Presentation', image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1000', availability_info: 'By reservation', is_active: 1, display_order: 5 },
    { id: 6, name: 'Spa & Wellness', category: 'recreation', description: 'Relaxing spa treatments and wellness therapies.', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1000', availability_info: 'Open 9:00 AM – 7:00 PM', is_active: 1, display_order: 6 },
    { id: 7, name: 'Gym', category: 'recreation', description: 'Modern fitness center equipped with the latest cardio and strength equipment.', icon: 'Dumbbell', image: null, availability_info: 'Open 24 hours', is_active: 1, display_order: 7 },
    { id: 8, name: 'Room Service', category: 'guest', description: 'In-room dining available around the clock.', icon: 'BellRing', image: null, availability_info: 'Available 24/7', is_active: 1, display_order: 8 }
  ],

  gallery: [
    { id: 1, image_url: galleryPhoto1, category: 'hotel', caption: 'Hotel Photo 1', display_order: 1 },
    { id: 2, image_url: galleryPhoto2, category: 'hotel', caption: 'Hotel Photo 2', display_order: 2 },
    { id: 3, image_url: galleryPhoto3, category: 'hotel', caption: 'Hotel Photo 3', display_order: 3 }
  ],

  events: [
    { id: 1, name: 'Wedding Ceremonies', category: 'wedding', description: 'Host your dream wedding in our elegant banquet hall or garden venue with full event support.', capacity: 'Up to 250 guests', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200', facilities: ['Bridal Suite', 'Catering', 'Decoration Services'], is_active: 1, display_order: 1 },
    { id: 2, name: 'Corporate Events', category: 'corporate', description: 'Professional venues and services tailored for corporate gatherings and product launches.', capacity: 'Up to 150 guests', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200', facilities: ['Projector & AV', 'High-speed Wi-Fi', 'Catering'], is_active: 1, display_order: 2 },
    { id: 3, name: 'Conferences & Meetings', category: 'conference', description: 'Fully equipped conference facilities with AV support for business meetings and seminars.', capacity: 'Up to 100 guests', image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200', facilities: ['Video Conferencing', 'Whiteboard', 'Catering'], is_active: 1, display_order: 3 },
    { id: 4, name: 'Birthday & Private Functions', category: 'birthday', description: 'Celebrate special occasions in our private function spaces with customizable setups.', capacity: 'Up to 80 guests', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200', facilities: ['Sound System', 'Catering', 'Decoration Services'], is_active: 1, display_order: 4 }
  ],

  testimonials: [
    { id: 1, customer_name: 'Amara Perera', rating: 5, comment: 'An unforgettable stay — the staff went above and beyond and the rooms were immaculate.', testimonial_date: '2026-06-12', is_active: 1, display_order: 1 },
    { id: 2, customer_name: 'James Whitfield', rating: 5, comment: 'Beautiful property with incredible ocean views. The restaurant food was outstanding.', testimonial_date: '2026-05-03', is_active: 1, display_order: 2 },
    { id: 3, customer_name: 'Nadia Karim', rating: 4, comment: 'Great location and very comfortable rooms. Would definitely come back.', testimonial_date: '2026-04-21', is_active: 1, display_order: 3 },
    { id: 4, customer_name: 'Ruwan Silva', rating: 5, comment: 'We hosted our wedding here and everything was perfect, from planning to execution.', testimonial_date: '2026-03-15', is_active: 1, display_order: 4 }
  ],

  inquiries: [],
  inquiryHistory: {},

  // Demo-only credentials — plain text because this is a frontend-only mock with no server.
  admins: [
    { id: 1, full_name: 'Hotel Administrator', username: 'admin', email: 'admin@serenitygrand.com', password: 'Admin@123', role: 'super_admin' }
  ],

  counters: { room: 5, facility: 9, gallery: 9, event: 5, testimonial: 5, inquiry: 0 }
};
