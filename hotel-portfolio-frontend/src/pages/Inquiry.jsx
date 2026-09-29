import { useSearchParams } from 'react-router-dom';
import InquiryForm from '../components/InquiryForm';

export default function Inquiry() {
  const [params] = useSearchParams();
  const type = params.get('type') || 'room';
  const room = params.get('room') || '';
  const event = params.get('event') || '';

  return (
    <div>
      <section className="relative flex h-[35vh] min-h-[240px] items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1600" alt="Make an inquiry" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-900/60" />
        <div className="relative z-10 text-center text-white">
          <p className="section-eyebrow text-gold-300">We'd Love to Hear From You</p>
          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">Make an Inquiry</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container-max max-w-3xl">
          <InquiryForm defaultType={type} defaultRoomType={room} defaultEventType={event} />
        </div>
      </section>
    </div>
  );
}
