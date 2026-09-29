import { useOutletContext } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import InquiryForm from '../components/InquiryForm';

export default function Contact() {
  const { contactInfo } = useOutletContext() || {};
  return (
    <div>
      <section className="relative flex h-[40vh] min-h-[280px] items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1600" alt="Contact" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-900/60" />
        <div className="relative z-10 text-center text-white">
          <p className="section-eyebrow text-gold-300">Get In Touch</p>
          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">Contact Us</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container-max grid gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            <div className="card flex items-start gap-3 p-5">
              <MapPin className="mt-0.5 text-gold-500" size={20} />
              <div>
                <p className="font-semibold text-charcoal-800">Address</p>
                <p className="text-sm text-charcoal-500">{contactInfo?.address}, {contactInfo?.city}, {contactInfo?.country}</p>
              </div>
            </div>
            <div className="card flex items-start gap-3 p-5">
              <Phone className="mt-0.5 text-gold-500" size={20} />
              <div>
                <p className="font-semibold text-charcoal-800">Phone</p>
                <p className="text-sm text-charcoal-500">{contactInfo?.phone}</p>
              </div>
            </div>
            <div className="card flex items-start gap-3 p-5">
              <Mail className="mt-0.5 text-gold-500" size={20} />
              <div>
                <p className="font-semibold text-charcoal-800">Email</p>
                <p className="text-sm text-charcoal-500">{contactInfo?.email}</p>
              </div>
            </div>
            <div className="card flex items-start gap-3 p-5">
              <Clock className="mt-0.5 text-gold-500" size={20} />
              <div>
                <p className="font-semibold text-charcoal-800">Hours</p>
                <p className="text-sm text-charcoal-500">Check-in {contactInfo?.check_in_time} &middot; Check-out {contactInfo?.check_out_time}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <InquiryForm defaultType="general" />
          </div>
        </div>
      </section>
    </div>
  );
}
