import * as Icons from 'lucide-react';

export default function FacilityCard({ facility }) {
  const Icon = Icons[facility.icon] || Icons.Sparkles;
  return (
    <div className="card flex h-full flex-col items-center justify-center p-6 text-center">
      {facility.image ? (
        <img src={facility.image} alt={facility.name} loading="lazy" className="mb-4 h-36 w-full rounded-xl object-cover" />
      ) : (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600">
          <Icon size={26} />
        </div>
      )}
      <h4 className="w-full font-serif text-lg font-semibold text-charcoal-800">{facility.name}</h4>
      {facility.description && <p className="mt-2 w-full text-sm text-charcoal-500">{facility.description}</p>}
      {facility.availability_info && <p className="mt-2 w-full text-xs font-medium text-gold-600">{facility.availability_info}</p>}
    </div>
  );
}
