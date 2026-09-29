import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORY_TO_INQUIRY = {
  wedding: 'wedding_event',
  birthday: 'wedding_event',
  private: 'wedding_event',
  corporate: 'corporate',
  conference: 'conference',
  meeting: 'conference',
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then((res) => setEvents(res.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative flex h-[40vh] min-h-[280px] items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600" alt="Events" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-900/60" />
        <div className="relative z-10 text-center text-white">
          <p className="section-eyebrow text-gold-300">Celebrations</p>
          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">Events &amp; Functions</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container-max">
          {loading ? <LoadingSpinner /> : (
            <div className="space-y-14">
              {events.map((ev, i) => (
                <div key={ev.id} className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
                  <img src={ev.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1000'} alt={ev.name} className="rounded-2xl shadow-lg" loading="lazy" />
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-charcoal-800">{ev.name}</h3>
                    <p className="mt-3 text-charcoal-500">{ev.description}</p>
                    {ev.capacity && (
                      <p className="mt-3 flex items-center gap-2 text-sm text-charcoal-600">
                        <Users size={16} className="text-gold-500" /> Capacity: {ev.capacity}
                      </p>
                    )}
                    {ev.facilities?.length > 0 && (
                      <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-charcoal-600">
                        {ev.facilities.map((f, idx) => (
                          <li key={idx} className="flex items-center gap-2"><CheckCircle size={14} className="text-gold-500" /> {f}</li>
                        ))}
                      </ul>
                    )}
                    <Link
                      to={`/inquiry?type=${CATEGORY_TO_INQUIRY[ev.category] || 'wedding_event'}&event=${encodeURIComponent(ev.name)}`}
                      className="btn-primary mt-6 inline-flex"
                    >
                      Inquire About This Event
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
