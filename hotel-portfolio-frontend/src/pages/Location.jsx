import { useOutletContext } from 'react-router-dom';
import { MapPin, Plane, Navigation2 } from 'lucide-react';

export default function LocationPage() {
  const { contactInfo } = useOutletContext() || {};
  const lat = contactInfo?.latitude || 7.2094;
  const lng = contactInfo?.longitude || 79.8380;
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div>
      <section className="relative flex h-[40vh] min-h-[280px] items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1600" alt="Location" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-900/60" />
        <div className="relative z-10 text-center text-white">
          <p className="section-eyebrow text-gold-300">Find Us</p>
          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">Location</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container-max grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <iframe title="Hotel location map" src={mapSrc} className="h-[420px] w-full border-0" loading="lazy" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-charcoal-800">
                <MapPin size={20} className="text-gold-500" /> Address
              </h3>
              <p className="mt-2 text-sm text-charcoal-500">{contactInfo?.address}, {contactInfo?.city}, {contactInfo?.country}</p>
            </div>
            {contactInfo?.distance_airport && (
              <div className="card p-6">
                <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-charcoal-800">
                  <Plane size={20} className="text-gold-500" /> From the Airport
                </h3>
                <p className="mt-2 text-sm text-charcoal-500">{contactInfo.distance_airport}</p>
              </div>
            )}
            <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn-primary w-full">
              <Navigation2 size={18} /> Get Directions
            </a>
          </div>
        </div>

        <div className="container-max mt-16">
          <h3 className="section-title mb-6 text-center">Nearby Attractions</h3>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {['Negombo Beach', 'Fish Market', 'Dutch Canal', 'St. Mary\'s Church'].map((place) => (
              <div key={place} className="card p-5 text-center text-sm font-medium text-charcoal-600">{place}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
