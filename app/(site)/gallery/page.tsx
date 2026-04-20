'use client';
import { useEffect, useState } from 'react';
import { initScrollReveal } from '@/components/ui/ScrollReveal';

interface GalleryItem { id: number; image: string; title: string; icon: string; sortOrder: number }

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(d => setItems(d.gallery || []));
  }, []);

  useEffect(() => {
    const obs = initScrollReveal();
    return () => obs?.disconnect();
  }, [items]);

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const hasImg = (img: string) => img && (img.startsWith('gallery_') || img.startsWith('product_') || img.startsWith('about_'));

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="container" style={{ paddingTop: '2rem' }}>
          <span className="page-hero-label">Atmosphere</span>
          <h1 className="page-hero-title">
            Visual <span className="italic" style={{ color: 'var(--primary)' }}>Stories</span>
          </h1>
          <p className="page-hero-sub">
            Lebih dari sekadar secangkir kopi. Ini tentang proses, dedikasi, dan kultur yang terbangun di Djaloe.
          </p>
        </div>
      </section>

      {/* Gallery grid */}
      <section style={{ padding: '4rem 0 8rem', background: 'var(--bg)' }}>
        <div className="container">
          {items.length > 0 ? (
            <div className="gallery-page-grid">
              {items.map((item, idx) => (
                <div key={item.id} className="gal-page-item scroll-in" data-delay={String((idx % 4) * 0.07)}
                  onClick={() => hasImg(item.image) && setLightbox(item)}>
                  {hasImg(item.image)
                    ? <img src={`/uploads/${item.image}`} alt={item.title} />
                    : <div className={`g${(idx % 4) + 1}`} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '4rem', filter: 'grayscale(1) brightness(.75)' }}>{item.icon || '📷'}</span>
                        <span style={{ color: 'rgba(255,255,255,.5)', fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.15em' }}>{item.title}</span>
                      </div>
                  }
                  <div className="gal-page-overlay" />
                  <div className="gal-page-meta">
                    <div className="gal-page-title">{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1px', background: 'var(--border)', marginBottom: '3rem' }}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div key={i} className={`g${(i % 4) + 1}`} style={{ aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '3rem', filter: 'grayscale(1) brightness(.6)', opacity: .7 }}>📷</span>
                  </div>
                ))}
              </div>
              <p style={{ color: 'var(--muted-fg)', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>Foto-foto akan segera hadir.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="modal-bg" onClick={() => setLightbox(null)} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <img src={`/uploads/${lightbox.image}`} alt={lightbox.title}
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem 1.25rem', background: 'linear-gradient(transparent,rgba(0,0,0,.7))' }}>
              <p style={{ color: '#fff', fontSize: '.875rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>{lightbox.title}</p>
            </div>
            <button className="modal-close" onClick={() => setLightbox(null)}
              style={{ position: 'absolute', top: '-.5rem', right: '-.5rem', background: '#2c1810', color: '#d4a96a', width: '2rem', height: '2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', border: 'none' }}>
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
