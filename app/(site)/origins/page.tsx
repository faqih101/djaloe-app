'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { initScrollReveal } from '@/components/ui/ScrollReveal';

interface Product { id: number; productSlug: string; name: string; origin: string; description: string; roastLevel: string; image: string; notes: string[] }

const RL: Record<string, string> = { Light: 'rl-light', Medium: 'rl-medium', 'Medium-Dark': 'rl-medium-dark', Dark: 'rl-dark' };
const FILTERS = ['Semua', 'Light', 'Medium', 'Medium-Dark', 'Dark'];

export default function OriginsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('Semua');

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(d => setProducts(d.products || []));
  }, []);

  useEffect(() => {
    const obs = initScrollReveal();
    return () => obs?.disconnect();
  }, [products, filter]);

  const filtered = filter === 'Semua' ? products : products.filter(p => p.roastLevel === filter);

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="container" style={{ paddingTop: '2rem' }}>
          <span className="page-hero-label">Our Selection</span>
          <h1 className="page-hero-title">
            Curated<br />
            <span className="italic" style={{ color: 'var(--primary)' }}>Origins</span>
          </h1>
          <p className="page-hero-sub">
            Pilihan biji kopi single origin terbaik dari penjuru Nusantara. Setiap kopi punya cerita, profil rasa, dan karakter uniknya sendiri.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '1.25rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.15em', color: 'var(--muted-fg)', marginRight: '.25rem' }}>Filter:</span>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '.375rem 1rem', fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.1em', border: '1px solid',
                  borderColor: filter === f ? 'var(--primary)' : 'var(--border)',
                  background: filter === f ? 'var(--primary)' : 'transparent',
                  color: filter === f ? 'var(--primary-fg)' : 'var(--muted-fg)',
                  cursor: 'pointer', transition: 'all .2s',
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section style={{ padding: '5rem 0 8rem', background: 'var(--bg)' }}>
        <div className="container">
          <div className="origins-grid">
            {filtered.map((p, idx) => (
              <div key={p.id} className="origin-card scroll-in" data-delay={String(idx * 0.07)}>
                <div className="origin-card-img">
                  {p.image
                    ? <img src={`/uploads/${p.image}`} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div className={`bg-${p.productSlug}`} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '4rem', filter: 'grayscale(1) brightness(.8)' }}>☕</span>
                      </div>
                  }
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.4) 0%,transparent 50%)' }} />
                  <div className={`prod-badge ${RL[p.roastLevel] || 'rl-medium'}`} style={{ position: 'absolute', top: '.75rem', right: '.75rem' }}>
                    {p.roastLevel}
                  </div>
                </div>
                <div className="origin-card-body">
                  <div className="origin-card-origin">{p.origin}</div>
                  <h3 className="origin-card-name">{p.name}</h3>
                  <p className="origin-card-desc">{p.description}</p>
                  <div className="origin-card-notes">
                    {p.notes.map(n => <span key={n} className="origin-card-note">{n}</span>)}
                  </div>
                  <div className="origin-card-footer">
                    <span className="origin-card-roast">Roast: {p.roastLevel}</span>
                    <Link href={`/origins/${p.productSlug}`} className="origin-card-link">
                      Detail <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted-fg)' }}>
              <p>Tidak ada produk dengan filter ini.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
