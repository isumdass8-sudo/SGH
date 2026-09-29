import { useEffect, useState } from 'react';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rooms').then((res) => setRooms(res.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative flex h-[40vh] min-h-[280px] items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600" alt="Rooms" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-900/60" />
        <div className="relative z-10 text-center text-white">
          <p className="section-eyebrow text-gold-300">Accommodation</p>
          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">Rooms &amp; Suites</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container-max">
          {loading ? <LoadingSpinner /> : rooms.length === 0 ? (
            <p className="text-center text-charcoal-500">No rooms available at the moment. Please check back soon.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((r) => <RoomCard key={r.id} room={r} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
