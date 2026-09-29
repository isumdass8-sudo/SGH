import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

export default function PublicLayout() {
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    api.get('/contact-info').then((res) => setContactInfo(res.data.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar contactInfo={contactInfo} />
      <main>
        <Outlet context={{ contactInfo }} />
      </main>
      <Footer contactInfo={contactInfo} />
    </div>
  );
}
