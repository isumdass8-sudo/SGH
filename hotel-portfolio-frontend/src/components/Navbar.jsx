import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import hotelLogo from '../assets/logo 123.jpeg';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/location', label: 'Location' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar({ contactInfo }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const solid = scrolled || location.pathname !== '/';

  return (
    <header className={`fixed top-0 z-40 w-full transition-all duration-300 ${solid ? 'bg-white/95 shadow-sm backdrop-blur' : 'bg-transparent'}`}>
      <nav className="container-max flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={hotelLogo} alt="Hotel logo" className="h-12 w-auto object-contain" />
          <span className={`font-serif text-xl font-bold tracking-wide ${solid ? 'text-charcoal-800' : 'text-white'}`}>
            {contactInfo?.hotel_name ? contactInfo.hotel_name.replace(/\s+Hotel\b/gi, '').trim() : 'Mount Aureliya Homestay'}
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition ${
                  isActive
                    ? 'text-gold-600'
                    : solid ? 'text-charcoal-600 hover:text-gold-600' : 'text-white/90 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/inquiry" className="btn-primary !px-5 !py-2.5">Make an Inquiry</Link>
        </div>

        <button className={`lg:hidden ${solid ? 'text-charcoal-800' : 'text-white'}`} onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-charcoal-100 bg-white lg:hidden">
          <div className="container-max flex flex-col gap-1 py-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-gold-50 text-gold-600' : 'text-charcoal-700'}`}
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/inquiry" className="btn-primary mt-2">Make an Inquiry</Link>
          </div>
        </div>
      )}
    </header>
  );
}
