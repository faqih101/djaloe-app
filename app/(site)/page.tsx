'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { initScrollReveal } from '@/components/ui/ScrollReveal';
import ReviewModal from '@/components/site/ReviewModal';
import StarRating from '@/components/ui/StarRating';

interface Product { id: number; productSlug: string; name: string; origin: string; description: string; roastLevel: string; image: string; notes: string[] }
interface ReviewDisplay {
  id: number; name: string; location: string; rating: number; review: string;
  date: string; initial: string; image?: string | null;
  productName?: string; productSlug?: string;
}
interface GalleryItem { id: number; image: string; title: string; icon: string }
interface Settings { [k: string]: string }

const RL: Record<string, string> = { Light: 'rl-light', Medium: 'rl-medium', 'Medium-Dark': 'rl-medium-dark', Dark: 'rl-dark' };

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<ReviewDisplay[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(d => {
      setProducts(d.products || []);
      setTestimonials(d.testimonials || []);
      setGallery(d.gallery || []);
      setSettings(d.settings || {});
    });
  }, []);

  useEffect(() => {
    // Hero fade-ups
    document.querySelectorAll('.fade-up').forEach(el => {
      const d = parseFloat((el as HTMLElement).dataset.delay || '0') * 1000;
      setTimeout(() => el.classList.add('show'), d + 200);
    });
    const obs = initScrollReveal();
    return () => obs?.disconnect();
  }, [products, testimonials]);

  const s = settings;

  return (
    <>
      {/* ── HERO ────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grad" />
          <div className="hero-dark" />
          <div className="hero-radial">
            <div className="hero-hatch" />
            <div className="hero-glow" />
          </div>
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <div className="badge fade-up" data-delay="0.1">
              <span className="badge-line" />
              <span className="badge-txt">{s.hero_badge_text || 'Est. 2019'}</span>
              <span className="badge-sub">{s.hero_badge_sub1 || 'Specialty Roastery'}</span>
              <span className="badge-sub">{s.hero_badge_sub2 || 'Bintaro'}</span>
              <span className="badge-line" />
            </div>
            <h1 className="hero-h1 fade-up" data-delay="0.3">{s.hero_title_line1 || 'The Art of'}</h1>
            <h1 className="hero-h1 accent italic fade-up" data-delay="0.42">{s.hero_title_line2 || 'Perfect'}</h1>
            <h1 className="hero-h1 fade-up" data-delay="0.54">{s.hero_title_line3 || 'Coffee.'}</h1>
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }} className="fade-up" data-delay="0.7">
              <Link href="/origins" className="btn-cta" style={{ fontSize: '.75rem', padding: '.75rem 2rem', letterSpacing: '.15em' }}>
                Explore Origins
              </Link>
              <Link href="/story" style={{ color: 'rgba(255,255,255,.7)', fontSize: '.75rem', letterSpacing: '.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '.5rem', transition: 'color .2s' }}>
                Our Story <span>→</span>
              </Link>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stats-grid">
              {[{ v: '7', l: 'Years Roasting' }, { v: '12', l: 'Origins Sourced' }, { v: '11K+', l: 'Happy Guests' }].map(st => (
                <div key={st.l}><div className="stat-val fade-up" data-delay="0.9">{st.v}</div><div className="stat-lbl">{st.l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT PREVIEW ───────────────────────────── */}
      <section className="about bg-base" id="about">
        <div className="watermark">Cintai Produk Lokal</div>
        <div className="container">
          <div className="vr scroll-in" style={{ marginBottom: '5rem' }}>The Roastery Story</div>
          <div className="about-grid">
            <div className="slide-left">
              <h2 className="section-h2">{s.about_title_line1 || 'A Love Letter to'}</h2>
              <h2 className="section-h2 italic muted">{s.about_title_line2 || 'Indonesian Soil'}</h2>
              <div className="about-body">
                <p>{s.about_paragraph1}</p>
                <p>{s.about_paragraph2}</p>
              </div>
              <div className="pull-quote">
                <div className="pq-bar" />
                <div className="pq-mark">&ldquo;</div>
                <p className="pq-text">{s.about_quote}</p>
              </div>
              <div className="tag-row">
                {['Single Origin', 'House Blend', 'Jasa Roasting', 'Gula Aren'].map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <Link href="/story" style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '.625rem', color: 'var(--primary)', fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.15em', borderBottom: '1px solid rgba(120,72,30,.3)', paddingBottom: '.25rem' }}>
                Baca Selengkapnya <span>→</span>
              </Link>
            </div>
            <div className="about-frame vf slide-right">
              <div className="about-img" style={s.about_image ? { backgroundImage: `url('/uploads/${s.about_image}')` } : {}}>
                {!s.about_image && (
                  <div style={{ textAlign: 'center', zIndex: 1 }}>
                    <div className="vr" style={{ marginBottom: '1rem' }}>
                      <span className="italic" style={{ fontFamily: 'var(--serif)', color: 'var(--primary)', fontSize: '.9375rem' }}>Djaloe Roastery</span>
                    </div>
                    <div className="about-cap">Est. 2019 · Bintaro, Indonesia</div>
                  </div>
                )}
                <div className="sepia-overlay" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS PREVIEW (first 3) ───────────────── */}
      <section className="products bg-card" id="origins">
        <div className="prod-overlay" />
        <div className="container">
          <div className="vr scroll-in" style={{ marginBottom: '1.5rem' }}>Our Selection</div>
          <div className="prod-header">
            <h2 className="prod-title scroll-in">Curated<br /><span className="italic muted" style={{ fontWeight: 400 }}>Origins</span></h2>
            <p className="prod-desc scroll-in" data-delay="0.1">Enam pilihan biji kopi single origin terbaik dari penjuru Nusantara.</p>
          </div>
          <div className="prod-grid">
            {products.slice(0, 6).map((p, idx) => (
              <div key={p.id} className="prod-card" data-delay={String(idx * 0.08)}>
                <div className={`prod-img${p.image ? '' : ` bg-${p.productSlug}`}`}
                  style={p.image ? { backgroundImage: `url('/uploads/${p.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                  <div className="prod-vignette" />
                  <div className="prod-num">No.{String(idx + 1).padStart(2, '0')}</div>
                  <div className={`prod-badge ${RL[p.roastLevel] || 'rl-medium'}`}>{p.roastLevel}</div>
                  {!p.image && <span className="prod-emoji">☕</span>}
                  <div className="prod-origin-lbl">{p.origin}</div>
                </div>
                <div className="prod-info">
                  <div className="prod-origin-tag">{p.origin}</div>
                  <h4 className="prod-name">{p.name}</h4>
                  <p className="prod-text">{p.description}</p>
                  <div className="prod-notes">{p.notes.map(n => <span key={n} className="prod-note">{n}</span>)}</div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '.5rem', paddingTop: '.75rem', borderTop: '1px solid var(--border)' }}>
                    <Link href={`/origins/${p.productSlug}`} className="prod-link-btn">Detail →</Link>
                    <button className="prod-link-btn" onClick={() => setSelectedProduct(p)}>Ulasan →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/origins" className="btn-outline">Lihat Semua Origins <span>→</span></Link>
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ─────────────────────────── */}
      <section className="gallery bg-base" id="gallery">
        <div className="container gallery-hdr">
          <div className="vr scroll-in" style={{ marginBottom: '2.5rem' }}>Atmosphere</div>
          <div className="gallery-title-row">
            <h2 className="gallery-title scroll-in">Visual <span className="italic muted" style={{ fontWeight: 400 }}>Stories</span></h2>
            <p className="gallery-sub scroll-in hidden-sm" data-delay="0.1">
              Lebih dari sekadar secangkir kopi. Tentang proses, dedikasi, dan kultur Djaloe.
            </p>
          </div>
        </div>
        <div className="gallery-grid">
          {(gallery.length > 0 ? gallery.slice(0, 4) : [0, 1, 2, 3]).map((item, idx) => {
            const g = typeof item === 'object' ? item : null;
            const hasImg = g?.image && (g.image.startsWith('gallery_') || g.image.startsWith('product_') || g.image.startsWith('about_'));
            return (
              <div key={idx} className="gal-item">
                <div className={`gal-inner${hasImg ? '' : ` g${(idx % 4) + 1}`}`}
                  style={hasImg ? { backgroundImage: `url('/uploads/${g!.image}')` } : {}}>
                  <div className="gal-vignette" />
                  <div className="gal-border-o" /><div className="gal-border-i" />
                  <span className="gal-icon">{g?.icon || '📷'}</span>
                  <div className="gal-meta">
                    <div className="gal-no">No. {String(idx + 1).padStart(2, '0')}</div>
                    <div className="gal-lbl">{g?.title || 'Coming Soon'}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <Link href="/gallery" className="btn-outline">Lihat Gallery Lengkap <span>→</span></Link>
        </div>
      </section>

      {/* ── REVIEWS (dari user nyata, bukan dummy) ──── */}
      <section className="testi bg-card" id="reviews">
        <div className="container">
          <div className="vr scroll-in" style={{ marginBottom: '2.5rem' }}>Customer Reviews</div>
          <div className="testi-hdr">
            <h2 className="testi-title scroll-in">
              What They <span className="italic muted" style={{ fontWeight: 400 }}>Say</span>
            </h2>
            <div className="rating-stamp scroll-in" data-delay="0.1">
              <div>
                <div className="r-num">{testimonials.length > 0 ? (testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length).toFixed(1) : '5.0'}</div>
                <div className="r-stars">★★★★★</div>
                <div className="r-lbl">{testimonials.length > 0 ? `${testimonials.length} Ulasan Terverifikasi` : 'Verified Users'}</div>
              </div>
              <div className="r-div" />
              <div className="r-right">
                <div className="r-gstar">✓</div>
                <div className="r-gtxt">Real</div>
                <div className="r-gtxt">Users</div>
              </div>
            </div>
          </div>

          {testimonials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px solid var(--border)', background: 'var(--bg)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☕</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', color: 'var(--fg)', marginBottom: '.75rem' }}>
                Jadilah yang Pertama Mereview
              </h3>
              <p style={{ color: 'var(--muted-fg)', fontSize: '.9375rem', maxWidth: '28rem', margin: '0 auto 2rem', lineHeight: 1.75, fontWeight: 300 }}>
                Sudah mencoba kopi Djaloe? Bagikan pengalamanmu kepada sesama pecinta kopi Indonesia.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/auth/register" style={{ display: 'inline-block', background: 'var(--primary)', color: 'var(--primary-fg)', padding: '.75rem 2rem', fontWeight: 600, fontSize: '.875rem', textDecoration: 'none' }}>
                  Daftar &amp; Review
                </Link>
                <Link href="/origins" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem' }}>
                  Lihat Produk
                </Link>
              </div>
            </div>
          ) : (
            <div className="testi-grid">
              {testimonials.map((t, i) => (
                <div key={t.id} className="testi-card vf" data-delay={String(i * 0.07)}>
                  {t.productName && (
                    <div style={{ marginBottom: '.75rem' }}>
                      <Link href={`/origins/${t.productSlug}`}
                        style={{ fontSize: '.6rem', textTransform: 'uppercase', letterSpacing: '.15em', color: 'var(--primary)', border: '1px solid rgba(120,72,30,.3)', padding: '.2rem .625rem', display: 'inline-block' }}>
                        {t.productName}
                      </Link>
                    </div>
                  )}
                  <div className="testi-quote">&ldquo;</div>
                  <p className="testi-text">{t.review}</p>
                  <div className="testi-footer">
                    <div className="testi-author">
                      <div className="avatar">
                        {t.image
                          ? <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }} />
                          : (t.initial || t.name.charAt(0).toUpperCase())
                        }
                      </div>
                      <div>
                        <div className="author-name">{t.name}</div>
                        <div className="author-loc">Verified User</div>
                      </div>
                    </div>
                    <StarRating rating={t.rating} />
                  </div>
                  <div className="testi-date">{t.date}</div>
                </div>
              ))}
            </div>
          )}

          {testimonials.length > 0 && (
            <div className="testi-cta scroll-in" data-delay="0.2">
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="https://linktr.ee/Djaloecoffeeroastery" target="_blank" rel="noopener" className="btn-outline">
                  Lihat Selengkapnya <span>→</span>
                </a>
                <Link href="/origins" className="btn-outline">
                  Tulis Ulasan <span>→</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA STRIP ───────────────────────────────── */}
      <section style={{ padding: '5rem 0', background: '#2c1810', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .04, backgroundImage: 'repeating-linear-gradient(45deg,#d4a96a 0,#d4a96a 1px,transparent 0,transparent 50%)', backgroundSize: '8px 8px' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="vr" style={{ marginBottom: '2rem', color: 'rgba(212,169,106,.5)' }}>
            <span style={{ color: '#d4a96a' }}>Hubungi Kami</span>
          </div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#fff', lineHeight: 1.1, marginBottom: '1rem' }}>
            Let&apos;s Talk <span style={{ color: '#d4a96a', fontStyle: 'italic' }}>Coffee.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.9375rem', maxWidth: '32rem', margin: '0 auto 2.5rem', lineHeight: 1.75, fontWeight: 300 }}>
            Tertarik berkolaborasi atau supply biji kopi untuk kedai Anda? Kami siap.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ background: '#d4a96a', color: '#2c1810', padding: '.875rem 2.5rem', fontWeight: 700, fontSize: '.8125rem', letterSpacing: '.15em', textTransform: 'uppercase' }}>
              Hubungi Kami
            </Link>
            <a href="https://wa.me/6287872639755" target="_blank" rel="noopener" style={{ border: '1px solid rgba(212,169,106,.4)', color: 'rgba(255,255,255,.8)', padding: '.875rem 2.5rem', fontSize: '.8125rem', letterSpacing: '.15em', textTransform: 'uppercase' }}>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {selectedProduct && <ReviewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  );
}
