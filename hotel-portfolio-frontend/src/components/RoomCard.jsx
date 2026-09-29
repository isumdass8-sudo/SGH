import { Link } from 'react-router-dom';
import { Users, BedDouble } from 'lucide-react';

export default function RoomCard({ room }) {
  return (
    <div className="card group overflow-hidden">
      <div className="relative h-56 overflow-hidden">
        <img
          src={room.main_image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200'}
          alt={room.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl font-semibold text-charcoal-800">{room.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-charcoal-500">{room.description}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-charcoal-500">
          {room.max_guests && <span className="flex items-center gap-1"><Users size={14} /> {room.max_guests} Guests</span>}
          {room.bed_type && <span className="flex items-center gap-1"><BedDouble size={14} /> {room.bed_type}</span>}
        </div>
        <div className="mt-5 flex gap-3">
          <Link to={`/rooms/${room.id}`} className="btn-secondary flex-1 !py-2 text-center">View More</Link>
          <Link to={`/inquiry?type=room&room=${encodeURIComponent(room.name)}`} className="btn-primary flex-1 !py-2 text-center">Inquire</Link>
        </div>
      </div>
    </div>
  );
}
