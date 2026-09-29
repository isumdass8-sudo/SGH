import { Link } from 'react-router-dom';
import { Clock, UtensilsCrossed } from 'lucide-react';

export default function Dining() {
  return (
    <div>
      <section className="relative flex h-[40vh] min-h-[280px] items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600" alt="Dining" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-900/60" />
        <div className="relative z-10 text-center text-white">
          <p className="section-eyebrow text-gold-300">Culinary Experience</p>
          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">Dining</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="container-max grid gap-12 md:grid-cols-2 md:items-center">
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000" alt="Restaurant" className="rounded-2xl shadow-lg" loading="lazy" />
          <div>
            <p className="section-eyebrow">Main Restaurant</p>
            <h2 className="section-title mt-2">A feast for every occasion</h2>
            <p className="mt-4 text-charcoal-500">
              Our restaurant offers a thoughtfully curated menu blending local Sri Lankan flavors with international
              cuisine, prepared by our experienced culinary team using the freshest local ingredients.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-charcoal-600">
              <Clock size={18} className="text-gold-500" /> Open daily, 7:00 AM – 11:00 PM
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm text-charcoal-600">
              <UtensilsCrossed size={18} className="text-gold-500" /> Local &amp; International Cuisine
            </div>
            <Link to="/inquiry?type=restaurant" className="btn-primary mt-8 inline-flex">Send a Dining Inquiry</Link>
          </div>
        </div>
      </section>

      <section className="bg-charcoal-50/40 py-16">
        <div className="container-max text-center">
          <p className="section-eyebrow">Private Dining</p>
          <h2 className="section-title mt-2">Bar &amp; Lounge</h2>
          <p className="mx-auto mt-4 max-w-xl text-charcoal-500">
            Unwind at our lounge with a curated selection of beverages, ideal for evening relaxation or private
            celebrations. Reach out to our team for group bookings and special dining requests.
          </p>
        </div>
      </section>
    </div>
  );
}
