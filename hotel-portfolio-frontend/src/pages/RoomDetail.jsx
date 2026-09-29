import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, BedDouble, Ruler, Eye, CheckCircle } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/rooms/${id}`).then((res) => setRoom(res.data.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-32"><LoadingSpinner /></div>;
  if (!room) return <div className="container-max py-32 text-center text-charcoal-500">Room not found.</div>;

  const images = [room.main_image, ...(room.gallery || [])].filter(Boolean);

  return (
    <div className="pt-24">
      <div className="container-max py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-2xl">
              <img src={images[activeImg]} alt={room.name} className="h-96 w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`h-20 w-28 shrink-0 overflow-hidden rounded-lg ring-2 ${activeImg === i ? 'ring-gold-500' : 'ring-transparent'}`}>
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal-800">{room.name}</h1>
            {room.price_display && <p className="mt-2 text-lg font-semibold text-gold-600">{room.price_display}</p>}
            <p className="mt-4 text-charcoal-500">{room.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-charcoal-600">
              {room.max_guests && <div className="flex items-center gap-2"><Users size={18} className="text-gold-500" /> Up to {room.max_guests} guests</div>}
              {room.bed_type && <div className="flex items-center gap-2"><BedDouble size={18} className="text-gold-500" /> {room.bed_type}</div>}
              {room.room_size && <div className="flex items-center gap-2"><Ruler size={18} className="text-gold-500" /> {room.room_size}</div>}
              {room.room_view && <div className="flex items-center gap-2"><Eye size={18} className="text-gold-500" /> {room.room_view}</div>}
            </div>

            {room.facilities?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-charcoal-800">Room Facilities</h3>
                <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-charcoal-600">
                  {room.facilities.map((f, i) => (
                    <li key={i} className="flex items-center gap-2"><CheckCircle size={14} className="text-gold-500" /> {f}</li>
                  ))}
                </ul>
              </div>
            )}

            <Link to={`/inquiry?type=room&room=${encodeURIComponent(room.name)}`} className="btn-primary mt-8 inline-flex">
              Send Inquiry for this Room
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
