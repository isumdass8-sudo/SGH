import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, BedDouble, Sparkles, Images, CalendarDays,
  MessageSquareQuote, Settings, LogOut, HotelIcon, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { to: '/admin/rooms', label: 'Rooms', icon: BedDouble },
  { to: '/admin/facilities', label: 'Facilities', icon: Sparkles },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/settings', label: 'Hotel Settings', icon: Settings },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-charcoal-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-charcoal-800 text-white transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center gap-2 border-b border-charcoal-700 px-6">
          <HotelIcon className="text-gold-400" size={24} />
          <span className="font-serif text-lg font-bold">Admin Panel</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-gold-500 text-white' : 'text-charcoal-300 hover:bg-charcoal-700 hover:text-white'
                }`
              }
            >
              <item.icon size={18} /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-charcoal-700 p-4">
          <p className="px-2 text-xs text-charcoal-400">Signed in as</p>
          <p className="px-2 text-sm font-semibold">{admin?.fullName || admin?.username}</p>
          <button onClick={handleLogout} className="mt-3 flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-charcoal-300 hover:bg-charcoal-700 hover:text-white">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main content */}
      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-charcoal-200 bg-white px-6 lg:hidden">
          <span className="font-serif text-lg font-bold text-charcoal-800">Admin Panel</span>
          <button onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
