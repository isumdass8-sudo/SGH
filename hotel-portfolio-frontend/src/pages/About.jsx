import { useOutletContext } from 'react-router-dom';
import { Building2, Users, Sparkles, Award } from 'lucide-react';
import aboutImage from '../assets/r1.png';
import aboutHeroImage from '../assets/bg 1.png';

const STATS = [
  { icon: Building2, label: 'Rooms & Suites', value: '48' },
  { icon: Award, label: 'Years of Service', value: '15+' },
  { icon: Sparkles, label: 'Facilities', value: '12' },
  { icon: Users, label: 'Happy Guests', value: '20k+' },
];

export default function About() {
  const { contactInfo } = useOutletContext() || {};
  return (
    <div>
      <section className="relative flex h-[45vh] min-h-[320px] items-center justify-center overflow-hidden">
        <img src={aboutHeroImage} alt="About hotel" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-900/60" />
        <div className="relative z-10 text-center text-white">
          <p className="section-eyebrow text-gold-300">About Us</p>
          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">Our Story</h1>
        </div>
      </section>

      <section className="py-20">
        <div className="container-max grid gap-12 md:grid-cols-2 md:items-center">
          <img src={aboutImage} alt="Hotel hospitality welcome" className="rounded-2xl shadow-lg" loading="lazy" />
          <div>
            <p className="section-eyebrow">Hotel Overview</p>
            <h2 className="section-title mt-2">Timeless elegance, modern comfort</h2>
            <p className="mt-4 text-charcoal-500">
              {contactInfo?.hotel_name || 'Our hotel'} has proudly served travelers with warmth and distinction, combining
              refined architecture with heartfelt hospitality. From our elegantly appointed rooms to our curated dining
              experiences, every detail is designed with our guests in mind.
            </p>
            <p className="mt-4 text-charcoal-500">
              Ideally located in {contactInfo?.city || 'Negombo'}, we offer easy access to the area's finest attractions while
              providing a tranquil retreat from the everyday.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-charcoal-50/40 py-16">
        <div className="container-max grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <s.icon className="mx-auto mb-3 text-gold-500" size={32} />
              <p className="font-serif text-3xl font-bold text-charcoal-800">{s.value}</p>
              <p className="mt-1 text-sm text-charcoal-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container-max grid gap-8 md:grid-cols-2">
          <div className="card p-8">
            <h3 className="font-serif text-2xl font-semibold text-charcoal-800">Our Mission</h3>
            <p className="mt-3 text-charcoal-500">
              To deliver exceptional hospitality experiences that exceed guest expectations, rooted in genuine care,
              attention to detail, and a passion for service excellence.
            </p>
          </div>
          <div className="card p-8">
            <h3 className="font-serif text-2xl font-semibold text-charcoal-800">Our Vision</h3>
            <p className="mt-3 text-charcoal-500">
              To be recognized as a leading destination for comfort and elegance, cherished by guests as a home away
              from home.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
