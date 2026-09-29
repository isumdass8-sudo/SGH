import FacilityCard from '../components/FacilityCard';

const facilities = [
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

export default function Facilities() {
  return (
    <div>
      <section className="relative flex h-[40vh] min-h-[280px] items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600" alt="Facilities" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-900/60" />
        <div className="relative z-10 text-center text-white">
          <p className="section-eyebrow text-gold-300">Amenities</p>
          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">Hotel Facilities &amp; Amenities</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container-max">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {facilities.map((f) => <FacilityCard key={f.id} facility={f} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
