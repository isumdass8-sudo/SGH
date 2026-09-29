import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import galleryHero from '../assets/1.jpeg';

const CATEGORIES = ['hotel'];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/gallery', { params: category ? { category } : {} })
      .then((res) => setImages(res.data.data))
      .finally(() => setLoading(false));
  }, [category]);

  function next() { setLightboxIndex((i) => (i + 1) % images.length); }
  function prev() { setLightboxIndex((i) => (i - 1 + images.length) % images.length); }

  return (
    <div>
      <section className="relative flex h-[40vh] min-h-[280px] items-center justify-center overflow-hidden">
        <img src={galleryHero} alt="Hotel property" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-900/60" />
        <div className="relative z-10 text-center text-white">
          <p className="section-eyebrow text-gold-300">Visual Tour</p>
          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">Gallery</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container-max">
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            <button onClick={() => setCategory('')} className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition ${category === '' ? 'bg-gold-500 text-white' : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'}`}>All</button>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition ${category === c ? 'bg-gold-500 text-white' : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'}`}>
                {c}
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : images.length === 0 ? (
            <p className="text-center text-charcoal-500">No images in this category yet.</p>
          ) : (
            <div className="columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
              {images.map((img, i) => (
                <button key={img.id} onClick={() => setLightboxIndex(i)} className="block w-full overflow-hidden rounded-xl">
                  <img src={img.image_url} alt={img.caption || ''} loading="lazy" className="w-full object-cover transition duration-500 hover:scale-105" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button className="absolute right-6 top-6 text-white/80 hover:text-white" onClick={() => setLightboxIndex(null)}><X size={32} /></button>
          <button className="absolute left-4 text-white/70 hover:text-white" onClick={prev}><ChevronLeft size={40} /></button>
          <img src={images[lightboxIndex].image_url} alt="" className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain" />
          <button className="absolute right-4 text-white/70 hover:text-white" onClick={next}><ChevronRight size={40} /></button>
          {images[lightboxIndex].caption && (
            <p className="absolute bottom-8 text-sm text-white/80">{images[lightboxIndex].caption}</p>
          )}
        </div>
      )}
    </div>
  );
}
