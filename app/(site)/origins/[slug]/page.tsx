'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import StarRating from '@/components/ui/StarRating';
import ReviewModal from '@/components/site/ReviewModal';
import { initScrollReveal } from '@/components/ui/ScrollReveal';

interface Product { id: number; productSlug: string; name: string; origin: string; description: string; roastLevel: string; image: string; notes: string[] }

const RL: Record<string, string> = { Light: 'rl-light', Medium: 'rl-medium', 'Medium-Dark': 'rl-medium-dark', Dark: 'rl-dark' };
const roastDesc: Record<string, string> = {
  Light: 'Roasting ringan mempertahankan karakter asli biji. Acidity lebih tinggi, body lebih ringan, aroma buah dan floral lebih menonjol.',
  Medium: 'Keseimbangan sempurna antara acidity dan body. Karakter origin masih terasa jelas dengan sedikit sweetness dari proses roasting.',
  'Medium-Dark': 'Body yang lebih tebal dengan sweetness caramel dan cokelat. Acidity berkurang, cocok untuk espresso dan milk-based drinks.',
  Dark: 'Full body, bold, dan intens. Notes tembakau, dark chocolate, dan earthy mendominasi. Cocok untuk kopi susu dan cold brew.',
};

export default function OriginDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(d => {
      const all: Product[] = d.products || [];
      const found = all.find(p => p.productSlug === slug);
      setProduct(found || null);
      setRelated(all.filter(p => p.productSlug !== slug).slice(0, 3));
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (!loading) {
      const obs = initScrollReveal();
      return () => obs?.disconnect();
    }
  }, [loading]);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-fg)' }}>
      Loading...
    </div>
  );

  if (!product) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <p style={{ color: 'var(--muted-fg)' }}>Produk tidak ditemukan.</p>
      <Link href="/origins" style={{ color: 'var(--primary)', fontSize: '.875rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>← Kembali ke Origins</Link>
    </div>
  );

  return (
    <>
      {/* Hero image */}
      <div className="origin-hero-img">
        {product.image
          ? <img src={`/uploads/${product.image}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div className={`bg-${product.productSlug}`} style={{ width: '100%', height: '100%' }} />
        }
        <div className="origin-hero-overlay" />
      </div>

      {/* Breadcrumb */}
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '.875rem 0' }}>
        <div className="container" style={{ display: 'flex', gap: '.75rem', fontSize: '.75rem', color: 'var(--muted-fg)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
          <Link href="/" style={{ transition: 'color .2s' }}>Home</Link>
          <span>/</span>
          <Link href="/origins" style={{ transition: 'color .2s' }}>Origins</Link>
          <span>/</span>
          <span style={{ color: 'var(--fg)' }}>{product.name}</span>
        </div>
      </div>

      {/* Detail */}
      <section className="origin-detail">
        <div className="container">
          <div className="origin-detail-grid">
            {/* Main */}
            <div>
              <div className="vr slide-left" style={{ marginBottom: '1.5rem' }}>Single Origin</div>
              <div className="origin-card-origin slide-left" style={{ marginBottom: '.5rem' }}>{product.origin}</div>
              <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.25rem,6vw,4rem)', color: 'var(--fg)', lineHeight: 1.05, marginBottom: '1.5rem' }} className="slide-left">
                {product.name}
              </h1>
              <p style={{ color: 'var(--muted-fg)', fontSize: '1rem', lineHeight: 1.85, fontWeight: 300, marginBottom: '2rem', maxWidth: '48rem' }} className="slide-left">
                {product.description}
              </p>

              <div className="slide-left" data-delay="0.1">
                <p style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.15em', color: 'var(--muted-fg)', marginBottom: '.75rem' }}>Tasting Notes</p>
                <div className="origin-notes-big">
                  {product.notes.map(n => <span key={n} className="origin-note-big">{n}</span>)}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginTop: '2rem' }} className="slide-left" data-delay="0.15">
                <p style={{ fontSize: '.6875rem', textTransform: 'uppercase', letterSpacing: '.15em', color: 'var(--muted-fg)', marginBottom: '.875rem' }}>Roast Profile</p>
                <div className={`roast-pill ${RL[product.roastLevel] || 'rl-medium'}`} style={{ marginBottom: '1rem' }}>{product.roastLevel}</div>
                <p style={{ color: 'var(--muted-fg)', fontSize: '.875rem', lineHeight: 1.75, fontWeight: 300, maxWidth: '40rem' }}>
                  {roastDesc[product.roastLevel] || ''}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }} className="slide-left" data-delay="0.2">
                <button className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem' }} onClick={() => setShowReview(true)}>
                  💬 Tulis & Lihat Ulasan
                </button>
                <a href="https://wa.me/6287872639755" target="_blank" rel="noopener" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem' }}>
                  Order via WhatsApp
                </a>
              </div>
            </div>

            {/* Sidebar */}
            <div className="origin-sidebar">
              <div className="origin-meta-card scroll-in">
                <span className="origin-meta-label">Daerah Asal</span>
                <div className="origin-meta-val">{product.origin}</div>
              </div>
              <div className="origin-meta-card scroll-in" data-delay="0.05">
                <span className="origin-meta-label">Roast Level</span>
                <div className="origin-meta-val">{product.roastLevel}</div>
              </div>
              <div className="origin-meta-card scroll-in" data-delay="0.1">
                <span className="origin-meta-label">Varietas</span>
                <div className="origin-meta-val">
                  {product.roastLevel === 'Dark' ? 'Robusta' : 'Arabika'}
                </div>
              </div>
              <div className="origin-meta-card scroll-in" data-delay="0.15">
                <span className="origin-meta-label">Cara Penyeduhan</span>
                <div style={{ fontSize: '.875rem', color: 'var(--fg)', lineHeight: 1.6 }}>
                  {product.roastLevel === 'Dark'
                    ? 'Espresso, Tubruk, Cold Brew, Moka Pot'
                    : product.roastLevel === 'Light'
                    ? 'Pour Over, V60, Chemex, Aeropress'
                    : 'Pour Over, French Press, Espresso, V60'}
                </div>
              </div>

              {/* Order card */}
              <div style={{ background: '#2c1810', padding: '1.75rem', border: '1px solid rgba(212,169,106,.2)' }} className="scroll-in" data-delay="0.2">
                <h4 style={{ fontFamily: 'var(--serif)', color: '#d4a96a', fontSize: '1.25rem', marginBottom: '.5rem' }}>Order Sekarang</h4>
                <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.8125rem', lineHeight: 1.65, marginBottom: '1.5rem', fontWeight: 300 }}>
                  Tersedia dalam kemasan 200g dan 500g. Pengiriman ke seluruh Indonesia.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.625rem' }}>
                  <a href="https://wa.me/6287872639755" target="_blank" rel="noopener" style={{ display: 'block', textAlign: 'center', background: '#d4a96a', color: '#2c1810', padding: '.75rem', fontWeight: 700, fontSize: '.8125rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                    WhatsApp
                  </a>
                  <a href="https://tk.tokopedia.com/ZSH5Ws53L/" target="_blank" rel="noopener" style={{ display: 'block', textAlign: 'center', border: '1px solid rgba(212,169,106,.35)', color: 'rgba(255,255,255,.7)', padding: '.75rem', fontSize: '.8125rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                    Tokopedia
                  </a>
                  <a href="https://gofood.link/a/Gx3zyyh" target="_blank" rel="noopener" style={{ display: 'block', textAlign: 'center', border: '1px solid rgba(212,169,106,.35)', color: 'rgba(255,255,255,.7)', padding: '.75rem', fontSize: '.8125rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                    GoFood
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
              <div className="vr scroll-in" style={{ marginBottom: '2.5rem' }}>Produk Lainnya</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.5rem' }}>
                {related.map((r, i) => (
                  <Link key={r.id} href={`/origins/${r.productSlug}`} className="origin-card scroll-in" data-delay={String(i * 0.08)} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
                    <div className="origin-card-img" style={{ aspectRatio: '16/9' }}>
                      {r.image
                        ? <img src={`/uploads/${r.image}`} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div className={`bg-${r.productSlug}`} style={{ width: '100%', height: '100%' }} />
                      }
                    </div>
                    <div className="origin-card-body">
                      <div className="origin-card-origin">{r.origin}</div>
                      <h3 className="origin-card-name">{r.name}</h3>
                      <div className="origin-card-footer">
                        <span className="origin-card-roast">{r.roastLevel}</span>
                        <span className="origin-card-link">Lihat <span>→</span></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {showReview && <ReviewModal product={product} onClose={() => setShowReview(false)} />}
    </>
  );
}
