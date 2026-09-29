import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    function onEsc(e) { if (e.key === 'Escape') onClose?.(); }
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl animate-slideUp`}>
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="font-serif text-xl font-semibold text-charcoal-800">{title}</h3>}
          <button onClick={onClose} className="ml-auto rounded-full p-1.5 text-charcoal-400 hover:bg-charcoal-100 hover:text-charcoal-700">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
